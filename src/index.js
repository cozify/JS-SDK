// @flow

//try { process.env.NODE_ENV } catch(e) { var process = { env: { NODE_ENV: 'production' } }; }


export {store, watchChanges} from "./store"


//import logger from 'redux-logger'
//const middleware = [...getDefaultMiddleware(), logger]

export { CLOUD_CONNECTION_STATES, HUB_CONNECTION_STATES} from './connection/constants';
export { LANGUAGES, USER_STATES, ROLES } from './user/constants';
export { HUB_STATES } from './hubs/constants';

export { getCloudConnectionState, getHubConnectionState } from "./connection/state"
export { changeLanguage, doPwLogin, acceptEula, getUserState } from "./user/user"
export { startDiscoveringHubs, getHubs, selectHubById, unSelectHubById, startPolling, stopPolling} from './hubs/hubs';
export { getDevices, getHubDevices} from './devices/devices';
export { sendDeviceCmd} from './devices/device';



export { devicesState, setDevices, deleteDevice } from "./reducers/devices";
export { hubsState, updateHubs } from "./reducers/hubs";






