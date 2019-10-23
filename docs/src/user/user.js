// 
import isString from 'lodash/isString';


import { send, COMMANDS } from '../connection/send';
import { store } from '../store';
import { userState } from '../reducers/user';

import { USER_STATES, LANGUAGES } from './constants';


/*
 * Helper to get user
 * @return {Object} user
 */
function storedUser() {
  return userState.selectors.getUser(store.getState());
}


/**
 * User action to change current language
 * @param {LANGUAGES_TYPE} newLanguage - language to be changed to
 * @return {Boolean} true if language was set
 */
export function changeLanguage(newLanguage) {
  let retVel = false;
  if (Object.values(LANGUAGES).indexOf(newLanguage) > -1) {
    store.dispatch(userState.actions.setLanguage(newLanguage));
    retVel = true;
    if (storedUser().state === USER_STATES.WAITING_LANGUAGE) {
      store.dispatch(userState.actions.changeState(USER_STATES.LANGUAGE_SET));
    }
  }
  return retVel;
}

/**
 * User action to accept EULA
 * @return {Boolean} true if EULA was accepted
 */
export function acceptEula() {
  store.dispatch(userState.actions.setEula(true));
  if (storedUser().state === USER_STATES.WAITING_EULA) {
    store.dispatch(userState.actions.changeState(USER_STATES.EULA_ACCEPTED));
  }
  return true;
}

/**
 * User action to log in
 * @param {string} email - email address
 * @param {password} password  - fixed password
 * @return { Promise}
 */
export function doPwLogin(email, password) {
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
 * User action to set user token
 * @param {string} userToken - Cozify user/cloud token
 * @return {Object} user
 */
export function setAuthenticated(userToken) {
  store.dispatch(userState.actions.setAuthenticated(userToken));
  return storedUser();
}

/**
 * Get state of user state-machine
 * @return {USER_STATE_TYPE}
 */
export function getUserState() {
  return storedUser().state;
}
