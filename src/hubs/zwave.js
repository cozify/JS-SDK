
// @flow
// import isEmpty from 'lodash/isEmpty';
import {
  ZWAVE_INCLUSION_STATES, ZWAVE_INCLUSION_INTERVAL_MS,
} from './constants';
// import { USER_STATES, ROLES } from '../user/constants';
import { HUB_CONNECTION_STATES } from '../connection/constants';
import { COMMANDS, send } from '../connection/send';
import { store } from '../store';
import { hubsState } from '../reducers/hubs';
import { userState } from '../reducers/user';

import type {
  HUB_TYPE, HUBS_MAP_TYPE, ZWAVE_INCLUSION_STATES_TYPE,
} from './constants';


/**
 * Helper to get current user from state
 */
function storedUser(): Object {
  return userState.selectors.getUser(store.getState());
}

/**
 * Helper to get current hubs from state
 * @return {HUBS_MAP_TYPE} - hubs
 */
export function getHubs(): HUBS_MAP_TYPE {
  return hubsState.selectors.getHubs(store.getState());
}

/*
** Z-wave inclusion
 */

const inclusionStopped: Object = {};
const inclusionInAction: Object = {};
const stopInclusionInAction: Object = {};
const inclusionState: Object = {};


/*
 * Start inclusion of given hub if hub connection is ok
 * @param {string} hubId
 * @return {Promise}
 */
function startZwaveInclusion(hubId: string): Promise<Object> {
  return new Promise((resolve, reject) => {
    if (inclusionStopped[hubId]) {
      console.debug('startZwaveInclusion: inclusion stopped');
      reject(new Error('inclusion stopped'));
      return;
    }
    const hub: HUB_TYPE = getHubs()[hubId];
    const { authKey } = storedUser();
    const { hubKey } = hub;

    console.debug('doInclusionById connection state: ', hub.connectionState);
    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.warn('SDK doInclusionById: no Hub connection');
      reject(new Error('no hub connection'));
      return;
    }

    if (inclusionInAction[hubId]) {
      reject(new Error('inclusion already in action'));
      return;
    }
    inclusionInAction[hubId] = true;

    send({
      command: COMMANDS.ZWAVE_START_INCLUSION, hubId, authKey, hubKey, localUrl: hub.url,
    })
      .then((state) => {
        inclusionState[hubId] = state;
        inclusionInAction[hubId] = false;
        if (state === ZWAVE_INCLUSION_STATES.RUNNING) {
          resolve(state);
        } else {
          reject(state);
        }
      })
      .catch((error) => {
      // store.dispatch(hubsState.actions.hubPollFailed())
        console.error('SDK: doInclusionById error: ', error.message);
        inclusionInAction[hubId] = false;
        reject(error);
      });
  });
}

/*
 * Ask inclusion status of given hub if hub connection is ok
 * @param {string} hubId
 * @return {Promise}
 */
function askZwaveInclusionStatus(hubId: string): Promise<Object> {
  return new Promise((resolve, reject) => {
    if (inclusionStopped[hubId]) {
      console.debug('askInclusionById: inclusion stopped');
      reject(new Error('inclusion stopped'));
      return;
    }
    const hub: HUB_TYPE = getHubs()[hubId];
    const { authKey } = storedUser();
    const { hubKey } = hub;

    console.debug('askInclusionById connection state: ', hub.connectionState);
    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.warn('SDK askInclusionById: no Hub connection');
      reject(new Error('no hub connection'));
      return;
    }

    if (inclusionInAction[hubId]) {
      reject(new Error('inclusion already in action'));
      return;
    }
    inclusionInAction[hubId] = true;

    send({
      command: COMMANDS.ZWAVE_INCLUSION_STATUS, hubId, authKey, hubKey, localUrl: hub.url,
    })
      .then((state) => {
        inclusionState[hubId] = state;
        inclusionInAction[hubId] = false;
        resolve(state);
      })
      .catch((error) => {
      // store.dispatch(hubsState.actions.hubPollFailed())
        console.error('SDK: askInclusionById error: ', error.message);
        inclusionInAction[hubId] = false;
        reject(error);
      });
  });
}


function askZwaveInclusionStatusPromise(hubId: string, resolve: (status: boolean) => mixed, reject: (error: any) => mixed) {
  askZwaveInclusionStatus(hubId)
    .then((state: ZWAVE_INCLUSION_STATES_TYPE) => {
      switch (state) {
        case ZWAVE_INCLUSION_STATES.RUNNING: {
          // sleep 5s and try again
          setTimeout(() => {
            debugger;
            askZwaveInclusionStatusPromise(hubId, resolve, reject);
          }, ZWAVE_INCLUSION_INTERVAL_MS);
          break;
        }
        case ZWAVE_INCLUSION_STATES.SUCCESS: {
          resolve(true);
          break;
        }
        case ZWAVE_INCLUSION_STATES.TIMEOUT: {
          resolve(false);
          break;
        }
        default: {
          reject(state);
          break;
        }
      }
    })
    .catch((error) => {
      console.error('Error in isZwaveById: ', error);
      reject(error);
    });
}


/**
 * Start zwave inclusion on given hub
 * @param {string} hubId
 * @return {Promise} that resolves true if device found and false if not
 */
export function doZwavePairing(hubId: string): Promise<Object> {
  return new Promise((resolve, reject) => {
    inclusionStopped[hubId] = false;

    startZwaveInclusion(hubId)
      .then((state: ZWAVE_INCLUSION_STATES_TYPE) => {
        if (state === ZWAVE_INCLUSION_STATES.RUNNING) {
          new Promise((r, j) => {
            askZwaveInclusionStatusPromise(hubId, r, j);
          }).then((result) => {
            resolve(result);
          }).catch((error) => {
            reject(error);
          });
        } else {
          reject(state);
        }
      })
      .catch((error) => {
        console.error('Error in startInclusionPollingById: ', error);
        reject(error);
      });
  });
}


/**
 * Stop zwave inclusion on given hub
 * @param {string} hubId
 * @return {Promise}
 */
export function stopZwavePairing(hubId: string): Promise<Object> {
  return new Promise((resolve, reject) => {
    if (stopInclusionInAction[hubId]) {
      reject(new Error('stopInclusionById already stopping'));
      return;
    }
    stopInclusionInAction[hubId] = true;

    const { authKey } = storedUser();
    const hub: HUB_TYPE = getHubs()[hubId];
    const { hubKey } = hub;

    send({
      command: COMMANDS.ZWAVE_STOP_INCLUSION, hubId, authKey, hubKey, localUrl: hub.url,
    })
      .then((status) => {
        console.debug('SDK: stopZwavePairing: Ok , status: ', status);
        inclusionStopped[hubId] = true;
        stopInclusionInAction[hubId] = false;
        resolve('ok');
      })
      .catch((error) => {
        console.error('SDK: stopZwavePairing error: ', error.message);
        stopInclusionInAction[hubId] = false;
        reject(error);
      });
  });
}

/**
 * Test if zwave of given hub is enabled
 * @param {string} hubId
 * @return {Promise} that resolves true if zwave is enabled
 */
export function isZwaveEnabled(hubId: string): Promise<Object> {
  return new Promise((resolve, reject) => {
    askZwaveInclusionStatus(hubId)
      .then((state) => {
        if (state !== ZWAVE_INCLUSION_STATES.NO_ZWAVE) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        console.error('Error in isZwaveById: ', error);
        reject(error);
      });
  });
}
