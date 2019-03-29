// @flow
import isEmpty from 'lodash/isEmpty';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import {isNode} from '../utils.js'
const CLOUD_URL: string = "https://cloud.cozify.fi/ui/0.2/";

export const COMMANDS = Object.freeze({
  USER_LOGIN: { method: 'POST', url: CLOUD_URL + "user/login", params: ['password', 'email'], config:{responseType: isNode ? 'blob' : 'stream', timeout: 5000} },
  HUB_KEYS: { method: 'GET', url: CLOUD_URL + "user/hubkeys"}
});



type ST = {
  command?: Object,
  url?: string,
  method?: string,
  authKey?: string,
  hubKey?: string,
  config?: Object,
  data?: Object
}

/**
 * Send method for REST API
 * @param  {Object} command         Optional command like USER_LOGIN
 * @param  {String} url             Optional url
 * @param  {String} method          Optional method
 * @param  {String} authKey         Optional authKey
 * @param  {String} hubKey          Optional hubKey
 * @param  {Object} config          Optional config that might have timeout or responseType configs to be used over defaults
 * @param  {Object} data            Optional data to be sent
 * @return {Promise}                Promise of results or error
 */
export function send({command = {}, url = '', method = 'GET', authKey = '' , hubKey = '', config ={}, data = {}}: ST): Promise<Object> {
  let body = {}

  //console.log("send: command ", command);

  if (typeof command != "undefined" && command){
    if (command.method) {
      method = command.method;
    }
    if (command.url) {
      url = command.url;
    }
    if (command.params) {
      command.params.forEach(param => {
          body[param] = data[param];
      });
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
      'Authorization': authKey
    },
    crossDomain: true,
    responseType: 'application/json',
    url: url,
    data: isEmpty(bodyString)? null : bodyString
  }

  Object.assign(reqConf, config);

  return new Promise( (resolve, reject) => {
    if (command) {

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
          resolve(response.data);

        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });

    } else {
      reject(new Error('Command not found.'));
    }
  });

  //headers: {"Authorization" : userToken},
  //contentType: "application/json;charset=utf-8",


}
