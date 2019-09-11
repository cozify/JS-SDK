// @flow
import isString from 'lodash/isString';


import { send, COMMANDS } from '../connection/send';
import { store } from '../store';
import { userState } from '../reducers/user';

import { USER_STATES, LANGUAGES } from './constants';
import type { LANGUAGES_TYPE } from './constants';


/*
 * Helper to get user
 * @return {Object} user
 */
function storedUser() {
  return userState.selectors.getUser(store.getState());
}


/**
 * User action to change current language
 * @type {LANGUAGES_TYPE}
 */
export function changeLanguage(newLanguage: LANGUAGES_TYPE): boolean {
  let retVel = false;
  if (Object.values(LANGUAGES).indexOf(newLanguage) > -1) {
    store.dispatch(userState.actions.setLanguage(newLanguage));
    if (storedUser().state === USER_STATES.WAITING_LANGUAGE) {
      store.dispatch(userState.actions.changeState(USER_STATES.LANGUAGE_SET));
    }
    retVel = true;
  }
  return retVel;
}

/**
 * User action to accept EULA
 */
export function acceptEula(): boolean {
  let retVel = false;
  store.dispatch(userState.actions.setEula(true));
  if (storedUser().state === USER_STATES.WAITING_EULA) {
    store.dispatch(userState.actions.changeState(USER_STATES.EULA_ACCEPTED));
  }
  retVel = true;

  return retVel;
}

/**
 * User action to log in
 * @param {string} email - email address
 * @param {password} password  - fixed password
 */
export function doPwLogin(email: string, password: string): Promise<Object> {
  return new Promise((resolve, reject) => {
    send({ command: COMMANDS.USER_LOGIN, data: { email, password } })
      .then((response) => {
        if (response && isString(response)) {
          store.dispatch(userState.actions.setAuthKey(response));
          if (storedUser().state === USER_STATES.WAITING_LOGIN) {
            store.dispatch(userState.actions.changeState(USER_STATES.LOGIN_DONE));
          }
        }
        resolve(response);
      })
      .catch((error) => {
        console.debug('doPwLogin error', error);
        reject(new Error('Login failure'));
      });
  });
}


/**
 * Get state of user state-machine
 */
export function getUserState() {
  return storedUser().state;
}
