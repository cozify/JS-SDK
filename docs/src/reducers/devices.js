// 

// This actionreducer uses internally https://github.com/mweststrate/immer, so it's safe to modify given state directly
import { createSlice } from 'redux-starter-kit';

/**
 * Devices action creators object
 * @see  https://github.com/reduxjs/redux-starter-kit/blob/master/docs/api/createSlice.md
 * @return { {
 *   slice : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */
export const devicesState = createSlice({
  slice: 'devices',
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
     * Reducer action of setting device state - sets all given devices of given hub, keeps existing states
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
      const { device } = action.payload;
      if (stateToSet[hubId]) {
        delete stateToSet[hubId][device.id];
      }
    },
  },
});

const { actions, reducer } = devicesState;
const devicesReducer = reducer;
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
