// 

// try { process.env.NODE_ENV } catch(e) { var process = { env: { NODE_ENV: 'production' } }; }


import rootReducer from './reducers';

export { rootReducer as cozifyReducer };
export { store, watchChanges } from './store';

// import logger from 'redux-logger'
// const middleware = [...getDefaultMiddleware(), logger]

export {
  CLOUD_CONNECTION_STATES, HUB_CONNECTION_STATES, useTestcloud, selectCloud,
} from './connection/constants';
export { LANGUAGES, USER_STATES, ROLES } from './user/constants';
export { HUB_STATES, ZWAVE_INCLUSION_STATUS, ZWAVE_EXCLUSION_STATUS } from './hubs/constants';

export { getCloudConnectionState, getHubConnectionState } from './connection/state';
export {
  changeLanguage, doPwLogin, setAuthenticated, acceptEula, getUserState,
} from './user/user';

export {
  fetchHubs,
  getHubs, selectHubById, unSelectHubById, unSelectHubs, connectHubByTokens, connectHubBySite,
  lockAndBackup,
  startDiscoveringHubs, stopDiscoveringHubs,
  startPollingById, stopPollingById,
  startPairingById, stopPairingById, ignorePairingByIds, stopPairings,
  doPoll, doRemoteIdQuery,
} from './hubs/hubs';
export {
  isZwaveEnabled,
  doZwaveInclusion,
  stopZwaveInclusion,
  doZwaveExclusion,
  stopZwaveExclusion,
  healZwave,
  getZwaveNodes,
  checkIsFailedZWaveNode,
  removeFailedZWaveNode,
  getZWaveNodeParameter,
  setZWaveNodeParameter,
} from './hubs/zwave';
export {
  getModbusDevicePairings, setModbusDevicePairings,
} from './hubs/modbus';
export {
  getDevices, getHubDevices,
  getPairingDevices, getHubPairingDevices,
} from './devices/devices';
export {
  sendDeviceStateCmd, sendDeviceCmd,
  unpairDevice, identifyDevice, setDeviceMeta,
  setDeviceVisibility, setDeviceLocked,
  setDeviceHotWater,
} from './devices/device';

export {
  getRooms, getHubRooms,
  addRoom, editRoom, removeRoom,
} from './rooms/rooms';

export {
  getAlarms, getHubAlarms,
  closeAlarm, removeAlarm,
} from './alarms/alarms';


export {
  reactSelectAllPlans,
  reactSubscribePlans,
  reactFetchPlans,
  reactInsertPlan,
  reactUpdatePlan,
  reactRemovePlan,
} from './reducers/plans';

export {
  reactSelectAllDocuments,
  reactSubscribePlanDocuments,
  reactSelectPlanDocuments,
  reactFetchPlanDocuments,
  reactInsertPlanDocument,
  reactUpdatePlanDocument,
  reactRemovePlanDocument,
} from './reducers/planDocuments';

export {
  reactSelectAllDocumentNodes,
  reactSubscribePlanDocumentNodes,
  reactSelectPlanDocumentNodes,
  reactFetchPlanDocumentNodes,
  reactInsertPlanDocumentNode,
  reactUpdatePlanDocumentNode,
  reactRemovePlanDocumentNode,
} from './reducers/planDocumentNodes';

export { PLAN_NODES } from './plans/constants';

export {
  urlBase64Decode,
} from './utils';

export { devicesState, setDevices, deleteDevice } from './reducers/devices';
export { hubsState, updateHubs } from './reducers/hubs';
