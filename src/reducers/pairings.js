// @flow

import { createSlice, createSelector, createEntityAdapter } from '@reduxjs/toolkit';

/**
 * Devices action creators object
 * @see  https://github.com/reduxjs/@reduxjs/toolkit/blob/master/docs/api/createSlice.md
 * @return { {
 *   name : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */
export const pairingsState = createSlice({
  name: 'pairings',
  initialState: {},
  reducers: {
    /*
     * Reducer action of setting pairing devices state - sets all given devices of given hub, keeps existing states
     * @param {Object} state
     * @param {Object} action
     */
    setPairingDevices(state, action) {
      const stateToSet = state;
      const { hubId } = action.payload;
      const { devices } = action.payload;
      const hubPairingDevices = {};


      Object.entries(devices).forEach((entry) => {
        const [id, device] = entry;
        hubPairingDevices[id] = { ...device };
      });
      stateToSet[hubId] = { ...hubPairingDevices };
    },

    /*
     * Reducer action of setting device state - sets  given device of given hub, keeps existing states
     * @param {Object} state
     * @param {payload:{Object{hubId:string, device:Object}}} action
     */
    setPairingDevice(state, action) {
      const stateToSet = state;
      const { hubId } = action.payload;
      const { device } = action.payload;
      if (stateToSet[hubId]) {
        stateToSet[hubId][device.id] = { ...device };
      }
    },

    /*
     * Reducer action to remove device from state - sets all given devices of given hub, keeps existing states
     * @param {Object} state
     * @param {payload:{Object{hubId:string, device:Object}}} action
     */
    deletePairingDevice(state, action) {
      const stateToSet = state;
      const { hubId } = action.payload;
      const { deviceId } = action.payload;
      if (hubId && deviceId && stateToSet[hubId] && stateToSet[hubId][deviceId]) {
        delete stateToSet[hubId][deviceId];
      }
    },
  },
});

const adapter = createEntityAdapter();
export const {
  selectById: selectPairingById,
  selectIds: selectPairingIds,
  selectEntities: selectPairingEntities,
  selectAll: selectAllPairings,
  selectTotal: selectTotalPairings,
} = adapter.getSelectors((state) => state.hubs);

pairingsState.selectors = adapter.getSelectors((state) => state.pairings);
pairingsState.selectors.getPairings = createSelector(
  [(state) => state.pairings],
  (pairings) => pairings,
);
const { actions, reducer } = pairingsState;

/**
 * Devices reducer
 * @type {function} reducer
 */
export { reducer as pairingsReducer };

// Extract and export each action creator by name
/*
console.log(addDevice({ id: 123, name: 'Unnamed device' }))
{type : "devices/addDevice", payload : {id : 123, name: 'Unnamed device' }}
*/
export const { setPairingDevices, deletePairingDevice } = actions;
