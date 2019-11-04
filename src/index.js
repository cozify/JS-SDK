// @flow

// try { process.env.NODE_ENV } catch(e) { var process = { env: { NODE_ENV: 'production' } }; }


import rootReducer from './reducers';

export { rootReducer as cozifyReducer };
export { store, watchChanges } from './store';

// import logger from 'redux-logger'
// const middleware = [...getDefaultMiddleware(), logger]

export { CLOUD_CONNECTION_STATES, HUB_CONNECTION_STATES, useTestcloud } from './connection/constants';
export { LANGUAGES, USER_STATES, ROLES } from './user/constants';
export { HUB_STATES } from './hubs/constants';

export { getCloudConnectionState, getHubConnectionState } from './connection/state';
export {
  changeLanguage, doPwLogin, setAuthenticated, acceptEula, getUserState,
} from './user/user';
export {
  getHubs, selectHubById, unSelectHubById, unSelectHubs, connectHubByTokens,
  startDiscoveringHubs, stopDiscoveringHubs,
  startPollingById, stopPollingById,
  startPairingById, stopPairingById, ignorePairingByIds, stopPairings,
  doPoll, doRemoteIdQuery,
} from './hubs/hubs';
export {
  getDevices, getHubDevices,
  getPairingDevices, getHubPairingDevices,
} from './devices/devices';
export {
  sendDeviceStateCmd, sendDeviceCmd,
  unpairDevice, identifyDevice, setDeviceMeta,
} from './devices/device';
export {
  getRooms, getHubRooms,
  addRoom, editRoom, removeRoom,
} from './rooms/rooms';


export { devicesState, setDevices, deleteDevice } from './reducers/devices';
export { hubsState, updateHubs } from './reducers/hubs';
