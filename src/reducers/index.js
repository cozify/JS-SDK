import { connectionsReducer } from './connections';
import { pairingsReducer } from './pairings';
import { devicesReducer } from './devices';
import { hubsReducer } from './hubs';
import { userReducer } from './user';

/**
 * Root reducer
 * @type {Object}
 */
const rootReducer = {
  connections: connectionsReducer,
  pairings: pairingsReducer,
  devices: devicesReducer,
  hubs: hubsReducer,
  user: userReducer,
};

export default rootReducer;
