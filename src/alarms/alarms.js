// @flow
import isEmpty from 'lodash/isEmpty';
// import isArray from 'lodash/isArray';
// import pick from 'lodash/pick';
import { store } from '../store';
import { alarmsState } from '../reducers/alarms';
import { hubsState } from '../reducers/hubs';
import { userState } from '../reducers/user';
import { b64DecodeUnicode, getTextFromNode } from '../utils';
import { send, COMMANDS } from '../connection/send';
import { HUB_CONNECTION_STATES, getCloudURL } from '../connection/constants';
import type { COMMANDS_TYPE } from '../connection/constants';
import type { ALARM_TYPE, ALARMS_MAP_TYPE, HUB_ALARMS_MAP_TYPE } from './constants';

const initAlarm = (alarm: Object) => {
  const givenAlarm = alarm;
  if (alarm.message) {
    givenAlarm.messageHTML = b64DecodeUnicode(alarm.message);
    givenAlarm.messageTxt = getTextFromNode(givenAlarm.message);
  }
  return givenAlarm;
};

/**
 * Get alarms of all selected hubs
 * @return {HUB_ALARMS_MAP_TYPE}
 */
export function getAlarms(): HUB_ALARMS_MAP_TYPE {
  const stateNow = store.getState();
  return alarmsState.selectors.getAlarms(stateNow);
}

/**
 * Get alarms of given hub
 * @param  {string} hubId
 * @return {ROOMS_MAP_TYPE}
 */
export function getHubAlarms(hubId: string): ?ALARMS_MAP_TYPE {
  let retVal: ?ALARMS_MAP_TYPE;
  const alarms: HUB_ALARMS_MAP_TYPE = getAlarms();
  if (alarms && alarms[hubId]) {
    retVal = alarms[hubId];
  }
  return retVal;
}


/**
 * Close given alarm of given hub
 * @param  {string} hubI
 * @param  {Object} alarm
 */

export function sendAlarmCmd(hubId: string, commandType: COMMANDS_TYPE, data: Object): Promise<Object> {
  return new Promise((resolve, reject) => {
    const stateNow = store.getState();
    const user = userState.selectors.getUser(stateNow);

    if (!user || !user.authKey) {
      console.error('SDK closeAlarm error: No userKey!');
      reject(new Error('Alarm command error: No userKey!'));
      return;
    }

    const hubs = hubsState.selectors.getHubs(stateNow);
    const hub = hubs[hubId];
    const { hubKey } = hubs[hubId];
    if (!hub || (!hubKey && getCloudURL().indexOf('https://directory')===-1)) {
      console.error('SDK closeAlarm error: No hubKey!');
      reject(new Error('Alarm command error: No hubKey!'));
      return;
    }

    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.error('SDK closeAlarm error: No Hub connection');
      reject(new Error('Alarm command error: No hub connection'));
      return;
    }

    const { authKey } = user;
    if (!authKey) {
      console.error('SDK closeAlarm error: No authKey!');
      reject(new Error('Alarm command error: No authKey!'));
      return;
    }

    send({
      command: commandType, authKey, hubId, localUrl: hub.url, hubKey, data,
    })
      .then((status) => {
        console.debug('SDK sendAlarmCmd ok', status);
        send({
          command: COMMANDS.CMD_GET_ALARMS, authKey, hubId, localUrl: hub.url, hubKey,
        })
          .then((alarms) => {
            console.debug('SDK sendAlarmCmd refresh alarms ok', alarms);
            store.dispatch(alarmsState.actions.setRooms({ hubId, alarms }));
            resolve(alarms);
          })
          .catch((error) => {
            console.error('SDK Alarm command error:', error);
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}


/**
 * Remove given alarm of given hub
 * @param  {string} hubId
 * @param  {Object} room
 */
export async function removeAlarm(hubId: string, alarm: ALARM_TYPE): Promise<ALARMS_MAP_TYPE> {
  const givenAlarm = alarm;
  return new Promise((resolve, reject) => {
    sendAlarmCmd(hubId, COMMANDS.CMD_REMOVE_ALARM, { alarmId: givenAlarm.id })
      .then((alarms) => {
        /*
        givenAlarm.closed = true;
        const stateAlarm = {
          hubId,
          alarmId: givenAlarm.id,
        };
        store.dispatch(alarmsState.actions.removeAlarm(stateAlarm));
        resolve(getAlarms());
        */
        resolve(alarms);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function closeAlarm(hubId: string, alarm: ALARM_TYPE): Promise<ALARMS_MAP_TYPE> {
  const givenAlarm = alarm;
  return new Promise((resolve, reject) => {
    sendAlarmCmd(hubId, COMMANDS.CMD_CLOSE_ALARM, { alarmId: givenAlarm.id })
      .then((alarms) => {
        /*
        givenAlarm.closed = true;
        const stateAlarm = {
          hubId,
          alarmId: givenAlarm.id,
        };
        store.dispatch(alarmsState.actions.setAlarm(stateAlarm));
        resolve(getAlarms());
        */
        resolve(alarms);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * Alarms handler for poll delta results
 * @param  {string} hubId
 * @param  {boolean} reset
 * @param  {Object} rooms
 */
export function alarmsDeltaHandler(hubId: string, reset: boolean, alarms: ALARMS_MAP_TYPE) {
  let oldHubAlarms: ALARMS_MAP_TYPE = {};
  const storedAlarms: HUB_ALARMS_MAP_TYPE = getAlarms();
  if (storedAlarms && storedAlarms[hubId]) {
    oldHubAlarms = storedAlarms[hubId];
  }

  if (reset) {
    // If reset then set alarms as they are received
    const alarmsToBeSet = {};
    if (!isEmpty(alarms)) {
      Object.entries(alarms).forEach(([key, alarm:ALARMS_MAP_TYPE]) => {
        alarmsToBeSet[key] = initAlarm(alarm);
      });
    }
    const stateAlarms = {
      hubId,
      alarms: alarmsToBeSet,
    };
    store.dispatch(alarmsState.actions.setAlarms(stateAlarms));
  } else if (!isEmpty(alarms)) {
    // Loop alarms to check could it be added or should be removed
    Object.entries(alarms).forEach(([key, alarm]) => {
      if (key && alarm) {
        const stateAlarm = {
          hubId,
          alarm: initAlarm(alarm),
        };
        store.dispatch(alarmsState.actions.setAlarm(stateAlarm));
      } else if (key && oldHubAlarms[key]) {
        store.dispatch(alarmsState.actions.removeAlarm({ hubId, alarmId: key }));
      }
    });
  }
}
