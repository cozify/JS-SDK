// @flow
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import axios from 'axios';
import axiosRetry from 'axios-retry';
// import rax from 'retry-axios';
import { urlBase64Decode } from '../utils';
import {
  COMMANDS, CLOUD_CONNECTION_STATES, getCloudURL, HUB_CONNECTION_STATES, MAX_API_VERSION,
} from './constants';
import {
  cloudErrorState, hubErrorState, testSSLCertificate, getAPIversion,
} from './send-utilities';
import { setCloudConnectionState, setHubConnectionState } from './state';
import { userState } from '../reducers/user';
import { LANGUAGES } from '../user/constants';
import { hubsState } from '../reducers/hubs';
import { store } from '../store';

import { retryCondition, resetRetry } from './send-retry';

import type { COMMAND_TYPE } from './constants';


export { COMMANDS };

let refreshingToken: boolean = false;

/* eslint no-use-before-define: ["error", { "functions": false }] */
/*
 * Refresh Auth key call
 */
function refreshAuthKey(authKey: string) {
  if (!refreshingToken) {
    refreshingToken = true;
    send({ command: COMMANDS.REFRESH_AUTHKEY, authKey })
      .then((response) => {
        setTimeout(() => { refreshingToken = false; }, 1000 * 60 * 10); // 10min
        if (response.length > 10) {
          store.dispatch(userState.actions.setAuthKey(response));
        }
      })
      .catch(() => {
        refreshingToken = false;
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
    exp = header.exp ? header.exp : payload.exp;
  }

  if (exp) {
    diff = exp - Math.round(new Date().getTime() / 1000);
  }

  if (!diff || diff < 0) {
    // User is unauthenticated
    setCloudConnectionState(CLOUD_CONNECTION_STATES.UNAUTHENTICATED);
  } else if (diff && diff < 5 * 24 * 60 * 60) {
    // refresh if < 5 days to exp date
    refreshAuthKey(key);
  }
}

/**
 * Send multiple requests
 * @param  {Array<Oject>} requests - requests to be send
 * @return {Promise}
 */
export function sendAll(requests: Array<any>): Promise<any> {
  return new Promise((resolve) => {
    Promise.all(requests)
      .then(() => {
        // Use the data from the results like so:
        // results[0].data
        // results[1].data
        resolve();
      })
      .catch(() => {
        // do whatever
        resolve();
      });
  });
}

axiosRetry(axios, {
  // retries: 1, DOESN'T WORK, see send_retry.js
  retryCondition,
  shouldResetTimeout: true,
  retryDelay: (retryCount, error) => {
    // console.error('axiosRetry ', retryCount); DOESN'T WORK , see send_retry.js
    console.error('axiosRetry ', error);
    return 5000; // retryCount * 1000;
  },
});

/* Flag to indicate SSL failures */
let permanentSSLFailure = false;

/**
 * Send method for REST API
 * @param {COMMAND_TYPE} params
 *
 * @return {Promise}
 *
 * @example
 *   send( {command: COMMANDS.USER_LOGIN,  data:{email:email, password:password} })
 *   .then((response) => {...});
 *
 * @example
 *   send( {command: COMMANDS.CMD_DEVICE, authKey: authKey, hubKey: hubKey, data:[{id:deviceId, state:state}] })
 *   .then((response) => {...});
 *
 * @example
 *   send( {url: hubURL + "/hub"} )
 *   .then((hubData) => {...});
 *
 */
export function send({
  command, localUrl, url, timeout, method, authKey, hubKey, type, config, data, hubId,
}: COMMAND_TYPE): Promise<any> {
  let sendMethod = method;
  let sendUrl = url;
  let sendTimeout = timeout;
  let sendAuthKey = authKey;
  let sendHubKey = hubKey;
  let sendConfig = config;
  let sendType = type;

  if (sendMethod == null) {
    sendMethod = 'GET';
  }
  if (sendType == null) {
    sendType = 'application/json;charset=UTF-8';
  }
  const body = data;
  /*
  if (isArray(data)) {
    body = [];
    body.push({});
  }
  */
  // console.log("send: command ", command);
  // Flag to indicate are we using remote (vrs.local) connection
  let remoteConnection = false;

  // Flag to indicate are we sending hub command meaning using commandAPI (vrs. some cloud/videocloud command like login, log etc)
  const hubCommand = !isEmpty(hubId);
  const stateNow = store.getState();
  const user = userState.selectors.getUser(stateNow);

  // const { storedAuthKey } = user;

  if (typeof command !== 'undefined' && command) {
    if (command.method) {
      sendMethod = command.method;
    }
    if (isEmpty(sendUrl) && command.url) {
      // command with Hub API version
      if (command.url.indexOf('$API_VER') !== -1) {
        const hubs = hubsState.selectors.getHubs(stateNow);
        if (!hubs[hubId] || !hubs[hubId].hubKey) {
          return new Promise((resolve, reject) => {
            reject(new Error('SDK Error: Send - Hub or hubKey not found error'));
          });
        }
        const hub = hubs[hubId];
        if (!hub.version || (hub.connectionState === HUB_CONNECTION_STATES.UNCONNECTED && command.url.indexOf('hub/remote/hub') === -1)) {
          return new Promise((resolve, reject) => {
            reject(new Error('SDK Error: Send - No Hub connection error'));
          });
        }
        const hubVersion = getAPIversion(hub.version, MAX_API_VERSION);
        sendUrl = getCloudURL().concat(command.url.replace('$API_VER', hubVersion));
      } else {
        sendUrl = getCloudURL().concat(command.url);
      }
    }

    if (sendUrl) {
      const parts = sendUrl.split('hub/remote');
      if (parts && parts[1]) {
        if (localUrl) {
          sendUrl = localUrl + parts[1];
          if (sendHubKey) {
            sendAuthKey = sendHubKey;
            sendHubKey = null;
          }
        }
      }
    }

    if (sendUrl && sendUrl.indexOf(getCloudURL()) > -1) {
      remoteConnection = true;
    }

    if (command.type && body) {
      if (isArray(body)) {
        if (body[0]) {
          body[0].type = command.type;
        } else {
          body.push({ type: command.type });
        }
      } else if (body) {
        body.type = command.type;
      }
    }

    if (command.params) {
      if (!command.params.includes('type')) {
        command.params.push('type');
      }
      command.params.forEach((param) => {
        if (isArray(data)) {
          if (body && body[0] && data && data[0]) {
            body[0][param] = data[0][param];
          }
        } else if (body && data) {
          body[param] = data[param];
        }
      });
    }

    if (command.urlParams) {
      const params: Array<string> = [];
      command.urlParams.forEach((param) => {
        if (data && data[param] !== undefined) {
          params.push(`${encodeURIComponent(param)}=${encodeURIComponent(data[param])}`);
        }
      });
      if (sendUrl && params.length > 0) {
        sendUrl = `${sendUrl}?${params.join('&')}`;
      }
    }

    if (command.timeout) {
      sendTimeout = command.timeout;
    }

    if (command.config) {
      sendConfig = command.config;
    }
  }

  const bodyString = JSON.stringify(body);

  const reqConf = {
    timeout: sendTimeout || 15000,
    method: sendMethod,
    // withCredentials: false,
    headers: {
      Accept: 'application/json, application/binary, text/plain, */*',
      'Content-Type': sendType,
      Authorization: sendAuthKey || null,
      'X-Hub-Key': sendHubKey || null,
      'Accept-Language': (user.language && user.language !== LANGUAGES.NONE) ? user.language : null,
    },
    crossDomain: true,
    responseType: 'application/json',
    url: sendUrl,
    data: isEmpty(bodyString) ? null : bodyString,
  };

  Object.assign(reqConf, sendConfig);

  return new Promise((resolve, reject) => {
    if (command || sendUrl) {
      axios.interceptors.response.use((response) => {
        if (response.headers['content-type'].includes('application/json') || response.headers['content-type'].includes('application/binary')) {
          resetRetry(sendUrl);
          return response;
        }
        console.error('send: unknown response type');
        return response; // Promise.reject(response);
      }, (error) => Promise.reject(error));
      /*
      axios.interceptors.request.use((reqConfig) => {
        //if (reqConfig.url.indexOf('192.168.1.119') !== -1) debugger;
        const rConfig = reqConfig;
        const retryState = rConfig['axios-retry'] || {};
        if (retryState.retryCount > 0) {
          rConfig.headers['x-retry-count'] = retryState.retryCount;
        }
        return rConfig;
      });
      */
      // retries if it is a network error or a 5xx error on an idempotent request (GET, HEAD, OPTIONS, PUT or DELETE).
      // axiosRetry(axios, {
      //  retries: 3, shouldResetTimeout: false, retryDelay: axiosRetry.exponentialDelay, retryCondition,
      // });
      //

      testSSLCertificate(remoteConnection)
        .then((status) => {
        // Cancel request if SSL Certificate status is invalid
          if (!status || permanentSSLFailure) {
            permanentSSLFailure = true;
            reject(new Error('SDK Error: SSL failure.'));
          } else {
          // SSL is ok,
            // check if auth Key needs to be refreshed
            if (sendAuthKey) {
              testAndRefreshToken(sendAuthKey);
            }

            // Send command
            // See options: https://github.com/axios/axios#request-config
            axios(reqConf)
              .then((response) => {
                // console.error("send: response ", response);
                if (remoteConnection) {
                  setCloudConnectionState(CLOUD_CONNECTION_STATES.CONNECTED);
                } else if (hubId) {
                  setHubConnectionState({ hubId, state: HUB_CONNECTION_STATES.LOCAL });
                }
                resolve(response.data);
              })
              .catch((error) => {
                let errorMsg = 'SDK Send error:';
                if (error && error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx

                  if (error.response.data && error.response.data.message) {
                    errorMsg = errorMsg.concat(error.response.data.message);
                  }
                  if (error.response.status) {
                    errorMsg = errorMsg.concat(`Status: ${error.response.status}`);
                  }

                  if (remoteConnection) {
                    if (command !== COMMANDS.CLOUD_META) {
                      setCloudConnectionState(cloudErrorState(error));
                    }
                    if (hubCommand && hubId) {
                      setHubConnectionState({ hubId, state: hubErrorState(error) });
                    }
                  } else {
                    // Local connection
                    // 401 means also cloud auth refresh is required
                    if (error && error.response && error.response.status === 401) {
                      setCloudConnectionState(cloudErrorState(error));
                    }
                    if (hubCommand && hubId) {
                      setHubConnectionState({ hubId, state: hubErrorState(error) });
                    }
                  }
                } else if (error.request) {
                  // The request was made but no response was received
                  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                  // http.ClientRequest in node.js
                  if (remoteConnection) {
                    setCloudConnectionState(CLOUD_CONNECTION_STATES.UNCONNECTED);
                    if (hubCommand && hubId) {
                      setHubConnectionState({ hubId, state: HUB_CONNECTION_STATES.UNCONNECTED });
                    }
                    errorMsg = errorMsg.concat(`Cloud unconnected in remote. Status ${error.request.status}`);
                  } else if (hubCommand && hubId) {
                    // Local connection
                    setHubConnectionState({ hubId, state: HUB_CONNECTION_STATES.UNCONNECTED });
                    errorMsg = errorMsg.concat(`Hub unconnected. Status ${error.request.status}`);
                  }
                } else if (remoteConnection) {
                  // Something happened in setting up the request that triggered an Error
                  setCloudConnectionState(CLOUD_CONNECTION_STATES.UNCONNECTED);
                  errorMsg = errorMsg.concat('Cloud unconnected in remote');
                  if (hubCommand && hubId) {
                    setHubConnectionState({ hubId, state: HUB_CONNECTION_STATES.UNCONNECTED });
                    errorMsg = errorMsg.concat('Hub unconnected in remote');
                  }
                } else if (hubCommand && hubId) {
                  // Local connection
                  setHubConnectionState({ hubId, state: HUB_CONNECTION_STATES.UNCONNECTED });
                  errorMsg = errorMsg.concat('Hub unconnected');
                }
                console.error(errorMsg);
                reject(error);
              });
          }
        });
    } else {
      reject(new Error('SDK Error: Command or Command API URL not found.'));
    }
  });
}
