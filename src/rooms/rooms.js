// @flow
import isEmpty from 'lodash/isEmpty';
// import isArray from 'lodash/isArray';
// import pick from 'lodash/pick';
import { store } from '../store';
import { roomsState } from '../reducers/rooms';
import { hubsState } from '../reducers/hubs';
import { userState } from '../reducers/user';
import { send, COMMANDS } from '../connection/send';
import { HUB_CONNECTION_STATES, getCloudURL } from '../connection/constants';
import type { COMMANDS_TYPE } from '../connection/constants';
import type { ROOM_TYPE, ROOMS_MAP_TYPE, HUB_ROOMS_MAP_TYPE } from './constants';


// import { ROOMS_FI, ROOMS_EN } from './constants';

/**
 * Get rooms of all selected hubs
 * @return {HUB_ROOMS_MAP_TYPE}
 */
export function getRooms(): HUB_ROOMS_MAP_TYPE {
  const stateNow = store.getState();
  return roomsState.selectors.getRooms(stateNow);
}

/**
 * Get rooms of given hub
 * @param  {string} hubId
 * @return {ROOMS_MAP_TYPE}
 */
export function getHubRooms(hubId: string): ?ROOMS_MAP_TYPE {
  let retVal: ?ROOMS_MAP_TYPE;
  const rooms: HUB_ROOMS_MAP_TYPE = getRooms();
  if (rooms && rooms[hubId]) {
    retVal = rooms[hubId];
  }
  return retVal;
}

export function sendRoomCmd(hubId: string, commandType: COMMANDS_TYPE, data: Object): Promise<Object> {
  return new Promise((resolve, reject) => {
    const stateNow = store.getState();
    const user = userState.selectors.getUser(stateNow);


    if (!user || !user.authKey) {
      console.error('SDK sendRoomCmd error: No userKey!');
      reject(new Error('Room command error: No userKey!'));
      return;
    }

    const hubs = hubsState.selectors.getHubs(stateNow);
    const hub = hubs[hubId];
    const { hubKey } = hubs[hubId];
    if (!hub || (!hubKey && getCloudURL().indexOf('https://one.cozify.fi') === -1)) {
      console.error('SDK sendRoomCmd error: No hubKey!');
      reject(new Error('Room command error: No hubKey!'));
      return;
    }

    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.error('SDK sendRoomCmd error: No Hub connection');
      reject(new Error('Room command error: No hub connection'));
      return;
    }

    const { authKey } = user;
    if (!authKey) {
      console.error('SDK sendRoomCmd error: No authKey!');
      reject(new Error('Room command error: No authKey!'));
      return;
    }

    if (commandType) {
      send({
        command: commandType, authKey, hubId, localUrl: hub.url, hubKey, data,
      })
        .then((status) => {
          console.debug('SDK sendRoomCmd ok', status);

          send({
            command: COMMANDS.CMD_GET_ROOMS, authKey, hubId, localUrl: hub.url, hubKey,
          })
            .then((rooms) => {
              console.debug('SDK sendRoomCmd refresh rooms ok', rooms);
              store.dispatch(roomsState.actions.setRooms({ hubId, rooms }));
              resolve(rooms);
            })
            .catch((error) => {
              console.error('SDK Room command error:', error);
              reject(error);
            });
        })
        .catch((error) => {
          console.error('SDK Room command error:', error);
          reject(error);
        });
    }
  });
}

/**
 * Add room to given hub
 * do not usr store.dispatch(roomsState.actions.addRoom(hubId, room)) as rooms are coming back in delta
 * @param  {string} hubId
 * @param  {Object} room
 * @return {Promise<Object>} rooms
 */
export async function addRoom(hubId: string, room: ROOM_TYPE): Promise<ROOMS_MAP_TYPE> {
  return new Promise((resolve, reject) => {
    sendRoomCmd(hubId, COMMANDS.CMD_SET_ROOM, [room])
      .then((rooms) => {
        resolve(rooms);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * Edit room of given hub
 * do not usr store.dispatch(roomsState.actions.editRoom(hubId, room)) as rooms are coming back in delta
 * @param  {string} hubId
 * @param  {Object} room
 * @return {Promise<Object>} rooms
 */
export async function editRoom(hubId: string, room: ROOM_TYPE): Promise<ROOMS_MAP_TYPE> {
  return new Promise((resolve, reject) => {
    sendRoomCmd(hubId, COMMANDS.CMD_SET_ROOM, [room])
      .then((rooms) => {
        resolve(rooms);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * Remove given room of given hub
 * @param  {string} hubId
 * @param  {Object} room
 */
export async function removeRoom(hubId: string, room: ROOM_TYPE): Promise<ROOMS_MAP_TYPE> {
  // store.dispatch(roomsState.actions.removeRoom(hubId, room));
  return new Promise((resolve, reject) => {
    sendRoomCmd(hubId, COMMANDS.CMD_REMOVE_ROOM, { roomId: room.id })
      .then((rooms) => {
        resolve(rooms);
      })
      .catch((error) => {
        if (error.response && error.response.status && error.response.status === 404) {
          const storedRooms: HUB_ROOMS_MAP_TYPE = getRooms();
          resolve(storedRooms[hubId]);
        }
        reject(error);
      });
  });
}

/**
 * Rooms handler for poll delta results
 * @param  {string} hubId
 * @param  {boolean} reset
 * @param  {Object} rooms
 */
export function roomsDeltaHandler(hubId: string, reset: boolean, rooms: Object) {
  let oldHubRooms: ROOMS_MAP_TYPE = {};
  const storedRooms: HUB_ROOMS_MAP_TYPE = getRooms();
  if (storedRooms && storedRooms[hubId]) {
    oldHubRooms = storedRooms[hubId];
  }

  if (reset) {
    // If reset then set rooms as they are received
    const stateRooms = {
      hubId,
      rooms,
    };
    store.dispatch(roomsState.actions.setRooms(stateRooms));
  } else if (!isEmpty(rooms)) {
    // Loop rooms to check could it be added or should be removed
    Object.entries(rooms).forEach(([key, room]) => {
      const stateRoom = {
        hubId,
        room,
      };
      if (key && room) {
        store.dispatch(roomsState.actions.setRoom(stateRoom));
      } else if (key && oldHubRooms[key]) {
        store.dispatch(roomsState.actions.removeRoom({ hubId, roomId: key }));
      }
    });
  }
}
