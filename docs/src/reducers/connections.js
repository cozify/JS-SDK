// 

import { createSlice, createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { CLOUD_CONNECTION_STATES } from '../connection/constants';
// import type { CLOUD_CONNECTION_STATE_TYPE } from '../connection/constants';


/**
 * Connections action creators object
 * @see  https://github.com/reduxjs/@reduxjs/toolkit/blob/master/docs/api/createSlice.md
 * @return { {
 *   slice : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */
export const connectionsState = createSlice({
  name: 'connections',
  initialState: {
    cloudState: CLOUD_CONNECTION_STATES.UNCONNECTED,
  },
  reducers: {
    /*
     * Reducer action of cloud connection state
     * @param {Object} state
     * @param {CLOUD_CONNECTION_STATES} action
     */
    setCloudConnectionState(state, action) {
      const stateToSet = state;
      const newState = action.payload;
      const oldState = state.cloudState;
      if (Object.values(CLOUD_CONNECTION_STATES).indexOf(newState) > -1) {
        if (oldState !== newState) {
          console.log(`CLOUD connection state ${oldState} -> ${newState}`);
          stateToSet.cloudState = newState;
        }
      }
    },


  },
});

const adapter = createEntityAdapter();
export const {
  selectById: selectConnectionById,
  selectIds: selectConnectionIds,
  selectEntities: selectConnectionEntities,
  selectAll: selectAllConnections,
  selectTotal: selectTotalConnections,
} = adapter.getSelectors((state) => state.hubs);

connectionsState.selectors = adapter.getSelectors((state) => state.connections);
connectionsState.selectors.getConnections = createSelector(
  [(state) => state.connections],
  (connections) => connections,
);

const { actions, reducer } = connectionsState;
/**
 * Connections reducer
 * @type {function} reducer
 */
export { reducer as connectionsReducer };

// Extract and export each action creator by name
export const { setCloudConnectionState } = actions;
