// 

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
export const devicesState = createSlice({
  name: 'devices',
  initialState: {},
  reducers: {
    /*
     * Reducer action of setting devices state - sets all given devices of given hub, keeps existing states
     * @param {Object} state
     * @param {Object} action
     */
    setDevices(state, action) {
      const stateToSet = state;
      const { hubId } = action.payload;
      const { devices } = action.payload;
      const hubDevices = {};


      Object.entries(devices).forEach((entry) => {
        const [id, device] = entry;
        hubDevices[id] = { ...device };
      });
      stateToSet[hubId] = { ...hubDevices };
    },

    /*
     * Reducer action of setting device state - sets  given device of given hub, keeps existing states
     * @param {Object} state
     * @param {payload:{Object{hubId:string, device:Object}}} action
     */
    setDevice(state, action) {
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
    deleteDevice(state, action) {
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
  selectById: selectDeviceById,
  selectIds: selectDeviceIds,
  selectEntities: selectDeviceEntities,
  selectAll: selectAllDevicess,
  selectTotal: selectTotalDevices,
} = adapter.getSelectors((state) => state.devices);

devicesState.selectors = adapter.getSelectors((state) => state.devices);
devicesState.selectors.getDevices = createSelector(
  [(state) => state.devices],
  (devices) => devices,
);

const { actions, reducer } = devicesState;

/**
 * Devices reducer
 * @type {function} reducer
 */
export { reducer as devicesReducer };

// Extract and export each action creator by name
/*
console.log(addDevice({ id: 123, name: 'Unnamed device' }))
{type : "devices/addDevice", payload : {id : 123, name: 'Unnamed device' }}
*/
export const { setDevices, deleteDevice } = actions;
