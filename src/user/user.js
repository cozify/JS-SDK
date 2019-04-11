// @flow
import isEmpty  from 'lodash/isEmpty';
import isString  from 'lodash/isString';


import { send, COMMANDS } from '../connection/send.js'
import { getStore } from "../store.js"
import { userState, userReducer } from "../reducers/user";

import { USER_STATES, ROLES, LANGUAGES } from './constants.js';
import type { USER_STATE_TYPE, ROLES_TYPE } from './constants.js';

function storedUser() {
  const stateNow = getStore().getState()
  const storedUser = userState.selectors.getUser(stateNow)
  return storedUser;
}


/**
 * User action to change current language
 * @type {LANGUAGES_TYPE}
 */
export function changeLanguage(newLanguage: LANGUAGES_TYPE): boolean {
  let retVel = false
  if (Object.values(LANGUAGES).indexOf(newLanguage) > -1) {
    getStore().dispatch(userState.actions.setLanguage(newLanguage));
    if (storedUser().state === USER_STATES.WAITING_LANGUAGE) {
      getStore().dispatch(userState.actions.changeState(USER_STATES.LANGUAGE_SET));
    }
    retVel = true;
  }
  return retVel;
}

/**
 * User action to accept EULA
 */
export function acceptEula(): boolean {
  let retVel = false
  getStore().dispatch(userState.actions.setEula(true));
  if (storedUser().state === USER_STATES.WAITING_EULA) {
    getStore().dispatch(userState.actions.changeState(USER_STATES.EULA_ACCEPTED));
  }
  retVel = true;

  return retVel;
}

/**
 * User action to log in
 * @param {string} email
 * @param {password} email  - fixed password
 */
export function doPwLogin(email: string, password: string): Promise<Object> {
  return new Promise( (resolve, reject) => {
    send( {command: COMMANDS.USER_LOGIN,  data:{email:email, password:password} })
      .then((response) => {
        if (response && isString(response)) {
          getStore().dispatch(userState.actions.setAuthKey(response));
          if (storedUser().state === USER_STATES.WAITING_LOGIN) {
            getStore().dispatch(userState.actions.changeState(USER_STATES.LOGIN_DONE));
          }
        }
        resolve(response);
      })
      .catch((error) => {
        //console.error(error);
        reject(false)
      });
  });
}

/**
 * Get state of user state-machine
 */
 export function getUserState() {
  return storedUser().state
 }


