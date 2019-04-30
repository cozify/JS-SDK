import {connectionsReducer} from './connections';
import {devicesReducer} from './devices';
import {hubsReducer} from './hubs';
import {userReducer} from './user';

/**
 * Root reducer
 * @type {Object}
 */
const rootReducer = {
  connections: connectionsReducer,
  devices: devicesReducer,
  hubs: hubsReducer,
  user: userReducer,
};

export {rootReducer}


