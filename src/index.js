// @flow

//try { process.env.NODE_ENV } catch(e) { var process = { env: { NODE_ENV: 'production' } }; }

import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import {rootReducer} from './reducers';

import {initStore, watchChanges} from "./store"

export const store = configureStore({
  reducer: rootReducer
  //middleware: [...getDefaultMiddleware(), logger]
  // default true like: devTools: process.env.NODE_ENV !== 'production'
  //preloadedState
  //enhancers: [reduxBatch]
});
console.log("Initial state", store.getState())
initStore(store);

//import logger from 'redux-logger'
//const middleware = [...getDefaultMiddleware(), logger]

export { CLOUD_CONNECTION_STATES, HUB_CONNECTION_STATES} from './connection/constants';
export { LANGUAGES, USER_STATES, ROLES } from './user/constants';
export { HUB_STATES } from './hubs/constants';

export { events } from './events/events'
export { EVENTS } from './events/constants'

export { getCloudConnectionState, getHubConnectionState } from "./connection/state"
export { changeLanguage, doPwLogin, acceptEula, getUserState } from "./user/user"
export { startDiscoveringHubs, getHubs, selectHubById, unSelectHubById, startPolling, stopPolling} from './hubs/hubs';
export { getDevices, getHubDevices} from './devices/devices';
export { sendDeviceCmd} from './devices/device';



export { devicesState, setDevices, deleteDevice } from "./reducers/devices";
export { hubsState, updateHubs } from "./reducers/hubs";

/*
let currentValue
function handleChange() {
  let previousValue = currentValue
  currentValue = select(store.getState())

  if (previousValue !== currentValue) {
    console.log(
      'Some deep nested property changed from',
      previousValue,
      'to',
      currentValue
    )
  }
}

const unsubscribe = store.subscribe(handleChange)
unsubscribe()
*/





