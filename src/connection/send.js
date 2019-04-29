// @flow
import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import { urlBase64Decode } from '../utils.js'
import { COMMANDS, CLOUD_CONNECTION_STATES, CLOUD_HOST, CLOUD_URL, CLOUD_API_VERSION, CLOUD_FINGERPRINTS_SHA1, HUB_CONNECTION_STATES } from './constants'
import { cloudErrorState, hubErrorState, testSSLCertificate } from './send-utilities'
import { setCloudConnectionState, setHubConnectionState } from './state'
import { userState } from "../reducers/user";
import { store } from "../store"

import {retryCondition} from './send-retry'

import type { COMMAND_TYPE } from './constants'


export {COMMANDS}

let _refreshingToken:boolean = false;

/*
 * Refresh Auth key call
 */
function refreshAuthKey(authKey: string) {
  if (!_refreshingToken) {
    _refreshingToken = true
    send( {command: COMMANDS.REFRESH_AUTHKEY, authKey: authKey} )
    .then((response) => {
      setTimeout(function() { _refreshingToken = false; }, 1000 * 60  * 10); //10min
      if (response.length > 10) {
          store.dispatch(userState.actions.setAuthKey(response));
      }
    })
    .catch((error) => {
      _refreshingToken = false
    });
  }
}

/*
 * Token refresh
 */
function testAndRefreshToken(key: string) {
    let exp: ?number = null;
    let header: {'exp': ?number} = {};
    let payload: {'exp': ?number} = {};
    let diff: ?number = null;

    if (key) {
        const tokenParts = key.split('.');
        header = JSON.parse(urlBase64Decode(tokenParts[0]));
        payload = JSON.parse(urlBase64Decode(tokenParts[1]));
    }

    if ((header && header.exp) || (payload != null && payload.exp)) {
        exp = header.exp ? header.exp : payload.exp
    }

    if (exp) {
        diff = exp - Math.round(new Date().getTime() / 1000)
    }

    if (!diff || diff < 0) {
      // User is unauthenticated
      setCloudConnectionState(CLOUD_CONNECTION_STATES.UNAUTHENTICATED);
    } else if (diff && diff <  5 * 24 * 60 * 60) {
      // refresh if < 5 days to exp date
      refreshAuthKey(key);
    }

}

/**
 * Sen multiple requests
 * @param  {[Oject]} requests - requests to be send
 * @return {Promise} promise object
 */
export function sendAll(requests: Array<any>): Promise<any> {
  return new Promise( (resolve, reject) => {

    Promise.all(requests)
    .then(results => {
        // Use the data from the results like so:
        // results[0].data
        // results[1].data
      resolve()
    })
    .catch(error => {
        // do whatever
      resolve()
    });

  });

}

/* Flag to indicate SSL failures */
let _permanentSSLFailure = false;

/**
 * Send method for REST API
 * @param  {Object} command         Optional command like USER_LOGIN
 * @param  {String} localUrl        Optional localUrl for direct hub access
 * @param  {String} localUrl        hub Id when messaging to hub
 * @param  {String} url             Optional url
 * @param  {String} method          Optional method
 * @param  {String} authKey         Optional authKey
 * @param  {String} hubKey          Optional hubKey
 * @param  {Object} config          Optional config that might have timeout or responseType configs to be used over defaults
 * @param  {Object} data            Optional data to be sent
 * @return {Promise}                Promise of results or error
 */
export function send({command, localUrl, hubId, url, method, authKey , hubKey, type, config, data}: COMMAND_TYPE): Promise<any> {
  if (method == null) {
    method = 'GET';
  }

  let body = data;
  /*
  if (isArray(data)) {
    body = [];
    body.push({});
  }
  */
  //console.log("send: command ", command);
  // Flag to indicate are we using remote (vrs.local) connection
  let remoteConnection = false;

  // Flag to indicate are we sending hub command meaning using commandAPI (vrs. some cloud/videocloud command like login, log etc)
  const hubCommand = isEmpty(hubId) ? false : true;

  if (typeof command != "undefined" && command){
    if (command.method) {
      method = command.method;
    }
    if (isEmpty(url) && command.url) {
      url = command.url;
    }

    if (url){
      var parts = url.split('hub/remote')
      if (parts && parts[1]){
        if (localUrl) {
            url = localUrl + parts[1]
            if (hubKey) {
              authKey = hubKey;
              hubKey = null;
            }
          }
      }
    }

    if (url && url.indexOf(CLOUD_URL) > -1) {
      remoteConnection = true;
    }

    if (command.type && body) {
        if (isArray(body)) {
          body[0]['type'] = command.type;
        } else {
          body['type'] = command.type;
        }
    }

    /*
    if (command.params) {
      command.params.forEach(param => {
        if (isArray(data)){
          body[0][param] = data[param];
        } else {
          body[param] = data[param];
        }
      });
    } */

    if (command.urlParams) {
      let params: Array<string> = [];
      command.urlParams.forEach(param => {
          if (data && data[param] !== undefined){
            params.push(encodeURIComponent(param) + '=' + encodeURIComponent(data[param]));
          }
      });
      if (url && params.length > 0) {
        url = url + "?" + params.join('&');
      }
    }

    if (command.config) {
      config = command.config;
    }

  }

  const bodyString = JSON.stringify(body);

  const reqConf ={
    timeout: 1000,
    method: method,
    //withCredentials: false,
    headers: {
      'Accept': 'application/json, application/binary, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': authKey,
      'X-Hub-Key': hubKey
    },
    crossDomain: true,
    responseType: 'application/json',
    url: url,
    data: isEmpty(bodyString) ? null : bodyString
  }

  Object.assign(reqConf, config);

  return new Promise( (resolve, reject) => {
    if (command || url) {

      axios.interceptors.response.use(response => {
        if(response.headers['content-type'] === 'application/json' || response.headers['content-type'] === 'application/binary') {
          return response
        }
        else {
         console.error("send: unknown response type");
         debugger;
         return Promise.reject(response);
        }
      }, error => Promise.reject(error));

      //retries if it is a network error or a 5xx error on an idempotent request (GET, HEAD, OPTIONS, PUT or DELETE).
      axiosRetry(axios, { retries: 3, shouldResetTimeout: true, retryCondition: retryCondition });

      testSSLCertificate(remoteConnection)
      .then(function (status) {
        // Cancel request if SSL Certificate status is invalid
        if (!status || _permanentSSLFailure) {

          _permanentSSLFailure = true;
          reject(new Error('SDK Error: SSL failure.'));

        } else {

          // SSL is ok,
          // check if auth Key needs to be refreshed
          if (authKey) {
            testAndRefreshToken(authKey);
          }

          // Send command
          // See options: https://github.com/axios/axios#request-config
          axios(reqConf)
          .then(function (response) {
            // console.error("send: response ", response);
            if (remoteConnection){
              setCloudConnectionState(CLOUD_CONNECTION_STATES.CONNECTED)
            } else if (hubId) {
              setHubConnectionState({hubId: hubId, state:HUB_CONNECTION_STATES.LOCAL})
            }
            resolve(response.data);

          })
          .catch(function (error) {
            if (error && error.response){
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              if (remoteConnection) {
                  if (command !== COMMANDS.CLOUD_META){
                    setCloudConnectionState(cloudErrorState(error))
                  }
                  if (hubCommand && hubId) {
                    setHubConnectionState({hubId: hubId, state: hubErrorState(error)})
                  }
              } else {
                // Local connection
                // 401 means also cloud auth refresh is required
                if (error && error.response && error.response.status === 401) {
                  setCloudConnectionState(cloudErrorState(error))
                }
                if (hubCommand && hubId) {
                  setHubConnectionState({hubId: hubId, state: hubErrorState(error)})
                }
              }
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              if (remoteConnection) {
                setCloudConnectionState(CLOUD_CONNECTION_STATES.UNCONNECTED)
                if (hubCommand && hubId) {
                    setHubConnectionState({hubId: hubId, state: HUB_CONNECTION_STATES.UNCONNECTED})
                }
              } else {
                // Local connection
                if (hubCommand && hubId) {
                  setHubConnectionState({hubId: hubId, state: HUB_CONNECTION_STATES.UNCONNECTED})
                }
              }
            } else {
              // Something happened in setting up the request that triggered an Error
              if (remoteConnection) {
                setCloudConnectionState(CLOUD_CONNECTION_STATES.UNCONNECTED)
                if (hubCommand && hubId) {
                    setHubConnectionState({hubId: hubId, state: HUB_CONNECTION_STATES.UNCONNECTED})
                }
              } else {
                // Local connection
                if (hubCommand && hubId) {
                  setHubConnectionState({hubId: hubId, state: HUB_CONNECTION_STATES.UNCONNECTED})
                }
              }
            }
            console.error('SDK send: error ', error);
            reject(new Error('SDK Error: Send error'));
          });
        }
      });
    } else {
      reject(new Error('SDK Error: Command or Command API URL not found.'));
    }
  });


}
