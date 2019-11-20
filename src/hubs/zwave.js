
// @flow
// import isEmpty from 'lodash/isEmpty';
import {
  ZWAVE_INCLUSION_STATES, ZWAVE_EXCLUSION_STATES, ZWAVE_INCLUSION_INTERVAL_MS, ZWAVE_EXCLUSION_INTERVAL_MS,
} from './constants';
// import { USER_STATES, ROLES } from '../user/constants';
import { HUB_CONNECTION_STATES } from '../connection/constants';
import { COMMANDS, send } from '../connection/send';
import { store } from '../store';
import { hubsState } from '../reducers/hubs';
import { userState } from '../reducers/user';

import type {
  HUB_TYPE, HUBS_MAP_TYPE, ZWAVE_INCLUSION_STATES_TYPE, ZWAVE_EXCLUSION_STATES_TYPE,
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

    console.debug('startZwaveInclusion connection state: ', hub.connectionState);
    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.warn('SDK startZwaveInclusion: no Hub connection');
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
        console.error('SDK: startZwaveInclusion error: ', error.message);
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
      console.debug('askZwaveInclusionStatus: inclusion stopped');
      reject(new Error('inclusion stopped'));
      return;
    }
    const hub: HUB_TYPE = getHubs()[hubId];
    const { authKey } = storedUser();
    const { hubKey } = hub;

    console.debug('askZwaveInclusionStatus connection state: ', hub.connectionState);
    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.warn('SDK askZwaveInclusionStatus: no Hub connection');
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
        console.error('SDK: askZwaveInclusionStatus error: ', error.message);
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
      console.error('Error in askZwaveInclusionStatusPromise: ', error);
      reject(error);
    });
}


/**
 * Start zwave inclusion on given hub
 * @param {string} hubId
 * @return {Promise} that resolves true if device found and false if not
 */
export async function doZwaveInclusion(hubId: string): Promise<Object> {
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
        console.error('Error in doZwavePairing: ', error);
        reject(error);
      });
  });
}


/**
 * Stop zwave inclusion on given hub
 * @param {string} hubId
 * @return {Promise}
 */
export async function stopZwaveInclusion(hubId: string): Promise<Object> {
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

export async function isZwaveEnabled(hubId: string): Promise<Object> {
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
*/


/*
**
** Z-wave exclusion
**
 */


const exclusionStopped: Object = {};
const exclusionInAction: Object = {};
const stopExclusionInAction: Object = {};
const exclusionState: Object = {};


/*
 * Start exclusion of given hub if hub connection is ok
 * @param {string} hubId
 * @return {Promise}
 */
function startZwaveExclusion(hubId: string): Promise<Object> {
  return new Promise((resolve, reject) => {
    if (exclusionStopped[hubId]) {
      console.debug('startZwaveExclusion: exclusion stopped');
      reject(new Error('exclusion stopped'));
      return;
    }
    const hub: HUB_TYPE = getHubs()[hubId];
    const { authKey } = storedUser();
    const { hubKey } = hub;

    console.debug('startZwaveExclusion connection state: ', hub.connectionState);
    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.warn('SDK startZwaveExclusion: no Hub connection');
      reject(new Error('no hub connection'));
      return;
    }

    if (exclusionInAction[hubId]) {
      reject(new Error('exclusion already in action'));
      return;
    }
    exclusionInAction[hubId] = true;

    send({
      command: COMMANDS.ZWAVE_START_EXCLUSION, hubId, authKey, hubKey, localUrl: hub.url,
    })
      .then((state) => {
        exclusionState[hubId] = state;
        exclusionInAction[hubId] = false;
        if (state === ZWAVE_EXCLUSION_STATES.RUNNING) {
          resolve(state);
        } else {
          reject(state);
        }
      })
      .catch((error) => {
      // store.dispatch(hubsState.actions.hubPollFailed())
        console.error('SDK: doExclusionById error: ', error.message);
        exclusionInAction[hubId] = false;
        reject(error);
      });
  });
}

/*
 * Ask exclusion status of given hub if hub connection is ok
 * @param {string} hubId
 * @return {Promise}
 */
function askZwaveExclusionStatus(hubId: string): Promise<Object> {
  return new Promise((resolve, reject) => {
    if (exclusionStopped[hubId]) {
      console.debug('askZwaveExclusionStatus: exclusion stopped');
      reject(new Error('exclusion stopped'));
      return;
    }
    const hub: HUB_TYPE = getHubs()[hubId];
    const { authKey } = storedUser();
    const { hubKey } = hub;

    console.debug('askZwaveExclusionStatus connection state: ', hub.connectionState);
    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.warn('SDK askZwaveExclusionStatus: no Hub connection');
      reject(new Error('no hub connection'));
      return;
    }

    if (exclusionInAction[hubId]) {
      reject(new Error('exclusion already in action'));
      return;
    }
    exclusionInAction[hubId] = true;
    send({
      command: COMMANDS.ZWAVE_EXCLUSION_STATUS, hubId, authKey, hubKey, localUrl: hub.url, data: {},
    })
      .then((state) => {
        exclusionState[hubId] = state;
        exclusionInAction[hubId] = false;
        resolve(state);
      })
      .catch((error) => {
      // store.dispatch(hubsState.actions.hubPollFailed())
        console.error('SDK: askZwaveExclusionStatus error: ', error.message);
        exclusionInAction[hubId] = false;
        reject(error);
      });
  });
}


function askZwaveExclusionStatusPromise(hubId: string, resolve: (status: boolean) => mixed, reject: (error: any) => mixed) {
  askZwaveExclusionStatus(hubId)
    .then((state: ZWAVE_EXCLUSION_STATES_TYPE) => {
      switch (state) {
        case ZWAVE_EXCLUSION_STATES.RUNNING: {
          // sleep 5s and try again
          setTimeout(() => {
            debugger;
            askZwaveExclusionStatusPromise(hubId, resolve, reject);
          }, ZWAVE_EXCLUSION_INTERVAL_MS);
          break;
        }
        case ZWAVE_EXCLUSION_STATES.SUCCESS: {
          resolve(true);
          break;
        }
        case ZWAVE_EXCLUSION_STATES.TIMEOUT: {
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
      console.error('Error in askZwaveExclusionStatusPromise: ', error);
      reject(error);
    });
}


/**
 * Start zwave exclusion on given hub
 * @param {string} hubId
 * @return {Promise} that resolves true if device found and false if not
 */
export async function doZwaveExclusion(hubId: string): Promise<Object> {
  return new Promise((resolve, reject) => {
    exclusionStopped[hubId] = false;

    startZwaveExclusion(hubId)
      .then((state: ZWAVE_EXCLUSION_STATES_TYPE) => {
        if (state === ZWAVE_EXCLUSION_STATES.RUNNING) {
          new Promise((r, j) => {
            askZwaveExclusionStatusPromise(hubId, r, j);
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
        console.error('Error in doZwaveExclusion: ', error);
        reject(error);
      });
  });
}


/**
 * Stop zwave exclusion on given hub
 * @param {string} hubId
 * @return {Promise}
 */
export async function stopZwaveExclusion(hubId: string): Promise<Object> {
  return new Promise((resolve, reject) => {
    if (stopExclusionInAction[hubId]) {
      reject(new Error('stopExclusionById already stopping'));
      return;
    }
    stopExclusionInAction[hubId] = true;

    const { authKey } = storedUser();
    const hub: HUB_TYPE = getHubs()[hubId];
    const { hubKey } = hub;

    send({
      command: COMMANDS.ZWAVE_STOP_EXCLUSION, hubId, authKey, hubKey, localUrl: hub.url,
    })
      .then((status) => {
        console.debug('SDK: stopZwaveExclusion: Ok , status: ', status);
        exclusionStopped[hubId] = true;
        stopExclusionInAction[hubId] = false;
        resolve('ok');
      })
      .catch((error) => {
        console.error('SDK: stopZwaveExclusion error: ', error.message);
        stopExclusionInAction[hubId] = false;
        reject(error);
      });
  });
}

/**
 * Test if zwave of given hub is enabled
 * @param {string} hubId
 * @return {Promise} that resolves true if zwave is enabled
 */
export async function isZwaveEnabled(hubId: string): Promise<Object> {
  return new Promise((resolve, reject) => {
    askZwaveExclusionStatus(hubId)
      .then((state) => {
        if (state !== ZWAVE_EXCLUSION_STATES.NO_ZWAVE) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        console.error('Error in isZwaveEnabled: ', error);
        reject(error);
      });
  });
}
