// @flow
import isEmpty from 'lodash/isEmpty'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import { isNode } from '../utils.js'
import { CLOUD_CONNECTION_STATES, CLOUD_URL, CLOUD_API_VERSION, HUB_CONNECTION_STATES } from './constants'
import { setCloudConnectionState, setHubConnectionState } from './state'

export const COMMANDS = Object.freeze({
  USER_LOGIN: { method: 'POST', url: CLOUD_URL + "user/login", params: ['password', 'email'], config:{responseType: isNode ? 'blob' : 'stream', timeout: 5000} },
  HUB_KEYS: { method: 'GET', url: CLOUD_URL + "user/hubkeys"},
  CLOUD_IP: {method: 'GET', url: CLOUD_URL + "hub/lan_ip"},
  CLOUD_META: {method: 'GET', url: CLOUD_URL + "hub/remote/hub"},
  POLL: {method: 'GET', url: CLOUD_URL + "hub/remote/cc/1.11" + "/hub/poll" , urlParams: ['ts']},
  //LOCAL_POLL: {method: 'GET', url: "cc/1.11/" + "/hub/poll?ts=0"},
});



type ST = {
  command?: Object,
  localUrl?: string,
  url?: string,
  method?: string,
  authKey?: string,
  hubKey?: string,
  config?: Object,
  data?: Object
}

export function sendAll(requests) {
  return new Promise( (resolve, reject) => {

    axios.all(requests)
    .then(axios.spread(function (succ, err) {
      // All requests are now complete
        resolve(succ);
    }))
    .catch(error => {
      reject(error);
    });

  });
}


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
export function send({command = {}, localUrl='', hubId='', url = '', method = 'GET', authKey = '' , hubKey = '', config ={}, data = {}}: ST): Promise<Object> {
  let body = {}

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

    var parts = url.split('hub/remote')
    if (parts && parts[1]){
      if (localUrl) {
          url = localUrl + parts[1]
          authKey = hubKey;
          hubKey = undefined;
        }
    }
    if (url.indexOf(CLOUD_URL) > -1) {
      remoteConnection = true;
    }

    if (command.params) {
      command.params.forEach(param => {
        body[param] = data[param];
      });
    }
    if (command.urlParams) {
      let params = []
      command.urlParams.forEach(param => {
          params.push(encodeURIComponent(param) + '=' + encodeURIComponent(data[param]));
      });
      url = url + "?" + params.join('&');
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
    data: isEmpty(bodyString)? null : bodyString
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


      axiosRetry(axios, { retries: 3, shouldResetTimeout: true });

      // See options: https://github.com/axios/axios#request-config
      axios(reqConf)
        .then(function (response) {
          // console.error("send: response ", response);
          if (remoteConnection){
            setCloudConnectionState(CLOUD_CONNECTION_STATES.CONNECTED)
          } else if (!isEmpty(hubId)) {
            setHubConnectionState({hubId: hubId, state:HUB_CONNECTION_STATES.LOCAL})
          }
          resolve(response.data);

        })
        .catch(function (error) {
          if (error.response){
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
          } else {
            // Something happened in setting up the request that triggered an Error
          }
          if (remoteConnection) {
            if (error && error.response && error.response.status === 400) {
              // no connection to offline hub
              console.log("send: no connection error ", error);
            } else if (error && error.response && error.response.status === 401) {
              // 401 Unauthorized
              console.error("send: unauhorized error ", error);
            } else {
              setCloudConnectionState(CLOUD_CONNECTION_STATES.UNCONNECTED)
              if (hubCommand) {
                setHubConnectionState({hubId: hubId, state: HUB_CONNECTION_STATES.UNCONNECTED})
              }
            }
          } else if (!isEmpty(hubId)) {
            setHubConnectionState({hubId: hubId, state: HUB_CONNECTION_STATES.UNCONNECTED})
          }
          console.error("send: error ", error);
          reject(error);
        });

    } else {
      reject(new Error('Command not found.'));
    }
  });

  //headers: {"Authorization" : userToken},
  //contentType: "application/json;charset=utf-8",


}
