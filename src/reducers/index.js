import { alarmsReducer } from './alarms';
import { connectionsReducer } from './connections';
import { pairingsReducer } from './pairings';
import { devicesReducer } from './devices';
import { hubsReducer } from './hubs';
import { userReducer } from './user';
import { roomsReducer } from './rooms';
import { plansReducer } from './plans';
import { planDocumentsReducer } from './planDocuments';
import { planDocumentNodesReducer } from './planDocumentNodes';

/**
 * Root reducer
 * @type {Object}
 */
const rootReducer = {
  alarms: alarmsReducer,
  connections: connectionsReducer,
  pairings: pairingsReducer,
  devices: devicesReducer,
  hubs: hubsReducer,
  user: userReducer,
  rooms: roomsReducer,
  plans: plansReducer,
  documents: planDocumentsReducer,
  nodes: planDocumentNodesReducer,
};

export default rootReducer;
