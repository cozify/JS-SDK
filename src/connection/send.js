// @flow
import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import { isNode, urlBase64Decode } from '../utils.js'
import { CLOUD_CONNECTION_STATES, CLOUD_HOST, CLOUD_URL, CLOUD_API_VERSION, CLOUD_FINGERPRINTS_SHA1, HUB_CONNECTION_STATES } from './constants'
import { setCloudConnectionState, setHubConnectionState } from './state'
import { store } from "../store"
import { userState } from "../reducers/user";
const SSL_CHECK_INTERVALL = 1000 * 60  * 60 //One hour
const SAFE_HTTP_METHODS = ['get', 'head', 'options'];
const IDEMPOTENT_HTTP_METHODS = SAFE_HTTP_METHODS.concat(['put', 'delete']);
/**
 * @param  {Error}  error
 * @return {boolean}
 */
function isNetworkError(error) {
  return (
    !error.response &&
    isRetryAllowed(error) && // Prevents retrying unsafe errors
    !(Boolean(error.code) && error.code == 'ECONNABORTED') // Prevents retrying timed out requests
  );
}


/**
 * @param  {Error}  error
 * @return {boolean}
 */
function isRetryableError(error) {
  return (
    error.code !== 'ECONNABORTED' &&
    (!error.response || (error.response.status >= 500 && error.response.status <= 599))
  );
}

/**
 * @param  {Error}  error
 * @return {boolean}
 */
function isSafeRequestError(error) {
  if (!error.config) {
    // Cannot determine if the request can be retried
    return false;
  }

  return isRetryableError(error) && SAFE_HTTP_METHODS.indexOf(error.config.method) !== -1;
}

/**
 * @param  {Error}  error
 * @return {boolean}
 */
function retryCondition(error) {
  if (!error.config) {
    // Cannot determine if the request can be retried
    return false;
  }

  return isRetryableError(error) && IDEMPOTENT_HTTP_METHODS.indexOf(error.config.method) !== -1;
}

/**
 * @param  {Error}  error
 * @return {boolean}
 */
function isNetworkOrIdempotentRequestError(error) {
  return isNetworkError(error) || isIdempotentRequestError(error);
}

let refreshingToken = false;
function refreshAuthKey(authKey) {
  if (!refreshingToken) {
    refreshingToken = true
    send( {command: COMMANDS.REFRESH_AUTHKEY, authKey: authKey} )
    .then((response) => {
      setTimeout(function() { refreshingToken = false; }, 1000 * 60  * 10); //10min
      if (response.length > 10) {
          store.dispatch(userState.actions.setAuthKey(response));
      }
    })
    .catch((error) => {
      refreshingToken = false
    });
  }
}

export const COMMANDS = Object.freeze({
  USER_LOGIN: { method: 'POST', url: CLOUD_URL + "user/login", params: ['password', 'email'], config:{responseType: isNode ? 'blob' : 'stream', timeout: 5000} },
  HUB_KEYS: { method: 'GET', url: CLOUD_URL + "user/hubkeys"},
  REFRESH_AUTHKEY: { method: 'GET', url: CLOUD_URL + "user/refreshsession"},
  CLOUD_IP: {method: 'GET', url: CLOUD_URL + "hub/lan_ip"},
  CLOUD_META: {method: 'GET', url: CLOUD_URL + "hub/remote/hub"},
  POLL: {method: 'GET', url: CLOUD_URL + "hub/remote/cc/1.11" + "/hub/poll" , urlParams: ['ts']},
  CMD_DEVICE: {method: 'PUT', url: CLOUD_URL + "hub/remote/cc/1.11" + "/devices/command", type: 'CMD_DEVICE', params: ['id', 'state']},
  //LOCAL_POLL: {method: 'GET', url: "cc/1.11/" + "/hub/poll?ts=0"},
});

/**
 * Return cloud connection state based on error
 * @param  {[type]} error [description]
 * @return {[type]}       [description]
 */
function cloudErrorState(error) {
  let retVal = CLOUD_CONNECTION_STATES.UNCONNECTED
  if (error && error.response && error.response.status === 401) {
    // 401 Authentication information missing or expired.
    retVal = CLOUD_CONNECTION_STATES.UNAUTHENTICATED
    console.error("send: authentication error ", error);
  } else if (error && error.response && error.response.status === 403) {
    // 402 Late payment - > no remote access
    retVal = CLOUD_CONNECTION_STATES.LATE_PAYMENT
    console.error("send: unauhorized error ", error);
  } else if (error && error.response && error.response.status === 403) {
    // 403 Unauthorized
    retVal = CLOUD_CONNECTION_STATES.UNAUTHORIZED
    console.error("send: unauhorized error ", error);
  } else if (error && error.response && error.response.status === 410) {
    // 410 Version problem
    retVal = CLOUD_CONNECTION_STATES.OBSOLETE_API_VERSION
    console.error("send: version error ", error);
  }

  return retVal
}



/**
 * Return hub connection state based on given error
 * @param  {Object} error
 * @return {string} hub's connectionState
 */
function hubErrorState(error) {
  let retVal = HUB_CONNECTION_STATES.UNCONNECTED
  if (error && error.response && error.response.status === 400) {
    // no connection to offline hub
    console.log("send: no-connection error ", error);
  } else if (error && error.response && error.response.status === 401) {
    // 401 Authentication information missing or expired.
    retVal = HUB_CONNECTION_STATES.UNAUTHENTICATED
    console.error("send: authentication error ", error);
  } else if (error && error.response && error.response.status === 403) {
    // 403 Unauthorized
    retVal = HUB_CONNECTION_STATES.UNAUTHORIZED
    console.error("send: unauhorized error ", error);
  } else if (error && error.response && error.response.status === 410) {
    // 410 Version problem
    retVal = HUB_CONNECTION_STATES.OBSOLETE_API_VERSION
    console.error("send: version error ", error);
  }

  return retVal
}

let ongoingSSLCertificateCheck = false;
let lastSSLCertificateCheckTime = undefined;
/**
 * Palceholder function for certificate checker
 * @return {Promise}
 */
function testSSLCertificate(remoteConnection) {
  return new Promise( (resolve, reject) => {

    if(!remoteConnection) {
      // All requests are now complete
      resolve(true);
      return;
    }

    let now = new Date().getTime()
    if (!ongoingSSLCertificateCheck && ( !lastSSLCertificateCheckTime || (now - lastSSLCertificateCheckTime  >  SSL_CHECK_INTERVALL ) ) ){
      ongoingSSLCertificateCheck = true
      lastSSLCertificateCheckTime = now

      // Cordova plugin?
      if (window && window.plugins && window.plugins.sslCertificateChecker) {
          window.plugins.sslCertificateChecker.check(
              (successMsg) => {
                  ongoingSSLCertificateCheck = false;
                  resolve(true);
              }
              ,(errorMsg) => {
                  if (errorMsg === "CONNECTION_NOT_SECURE") {
                    ongoingSSLCertificateCheck = false
                    resolve(false);
                  }
                  else{
                    ongoingSSLCertificateCheck = false
                    lastSSLCertificateCheckTime = undefined
                    resolve(true);
                  }
              }
              , CLOUD_HOST
              , CLOUD_FINGERPRINTS_SHA1
          )
      } else {
          setTimeout(function() {ongoingSSLCertificateCheck = false}, SSL_CHECK_INTERVALL);
          resolve(true);
      }
    } else {
      resolve(true);
    }

  });

}

/**
 * get Token refresh
 * @param  {[type]} authKey [description]
 * @return {[type]}       [description]
 */
function testAndRefreshToken(authKey) {
    let exp = undefined;
    let header = undefined;
    let payload = undefined;
    let diff = undefined

    if (authKey) {
        const tokenParts = authKey.split('.');
        header = JSON.parse(urlBase64Decode(tokenParts[0]));
        payload = JSON.parse(urlBase64Decode(tokenParts[1]));
    }

    if ((header && header.exp) || (payload && payload.exp)) {
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
      refreshAuthKey(authKey);
    }

}

type ST = {
  command?: Object,
  localUrl?: string,
  url?: string,
  method?: string,
  authKey?: string,
  hubKey?: string,
  config?: Object,
  data?: Object,
  type?: string
}

export function sendAll(requests) {
  return new Promise( (resolve, reject) => {
    // retries if it is a network error or a 5xx error on an idempotent request (GET, HEAD, OPTIONS, PUT or DELETE).
    axiosRetry(axios, { retries: 3, shouldResetTimeout: true, retryCondition: retryCondition });
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

/** @type {Boolean} Flag to indicate SSL failures */
let permanentSSLFailure = false;

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
export function send({command = {}, localUrl='', hubId='', url = '', method = 'GET', authKey = '' , hubKey = '', type = '', config ={}, data = {}}: ST): Promise<Object> {
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

    if (command.type) {
        if (isArray(data)) {
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

      //retries if it is a network error or a 5xx error on an idempotent request (GET, HEAD, OPTIONS, PUT or DELETE).
      axiosRetry(axios, { retries: 3, shouldResetTimeout: true, retryCondition: retryCondition });

      testSSLCertificate(remoteConnection)
      .then(function (status) {
        // Cancel request if SSL Certificate status is invalid
        if (!status || permanentSSLFailure) {

          permanentSSLFailure = true;
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
            } else if (!isEmpty(hubId)) {
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
                  if (hubCommand) {
                    setHubConnectionState({hubId: hubId, state: hubErrorState(error)})
                  }
              } else {
                // Local connection
                // 401 means also cloud auth refresh is required
                if (error && error.response && error.response.status === 401) {
                  setCloudConnectionState(cloudErrorState(error))
                }
                if (hubCommand) {
                  setHubConnectionState({hubId: hubId, state: hubErrorState(error)})
                }
              }
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              if (remoteConnection) {
                setCloudConnectionState(CLOUD_CONNECTION_STATES.UNCONNECTED)
                if (hubCommand) {
                    setHubConnectionState({hubId: hubId, state: HUB_CONNECTION_STATES.UNCONNECTED})
                }
              } else {
                // Local connection
                if (hubCommand) {
                  setHubConnectionState({hubId: hubId, state: HUB_CONNECTION_STATES.UNCONNECTED})
                }
              }
            } else {
              // Something happened in setting up the request that triggered an Error
              if (remoteConnection) {
                setCloudConnectionState(CLOUD_CONNECTION_STATES.UNCONNECTED)
                if (hubCommand) {
                    setHubConnectionState({hubId: hubId, state: HUB_CONNECTION_STATES.UNCONNECTED})
                }
              } else {
                // Local connection
                if (hubCommand) {
                  setHubConnectionState({hubId: hubId, state: HUB_CONNECTION_STATES.UNCONNECTED})
                }
              }
            }
            console.error('SDK send: error ', error);
            reject(new Error('SDK send: error ', error));
          });
        }
      });
    } else {
      reject(new Error('SDK Error: Command or Command API URL not found.'));
    }
  });

  //headers: {"Authorization" : userToken},
  //contentType: "application/json;charset=utf-8",


}
