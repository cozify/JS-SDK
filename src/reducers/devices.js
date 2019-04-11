// @flow

// This actionreducer uses internally https://github.com/mweststrate/immer, so it's safe to modify given state directly
import { createSlice } from 'redux-starter-kit'


const devicesState = createSlice({
  slice: 'devices',
  initialState: {},
  reducers: {
    setDevices(state, action) {
      const hubId = action.payload.hubId;
      const devices = action.payload.devices;
      const hubDevices = {}
      for (const [id, device] of Object.entries(devices)) {
        hubDevices[id] = {...device};
      }
      state[hubId] = {...hubDevices};
    },

    setDevice(state, action) {
      const hubId = action.payload.hubId;
      const device = action.payload.device;
      state[hubId][device.id] = {...device}
    },

    deleteDevice(state, action) {
      const hubId = action.payload.hubId;
      const device = action.payload.device;
      delete state[hubId][device.id]
    }
  }
})

const { actions, reducer } = devicesState
const devicesReducer = reducer
// Extract the action creators object
export {devicesState}
// Export the reducer
export {devicesReducer}

// Extract and export each action creator by name
/*
console.log(addDevice({ id: 123, name: 'Unnamed device' }))
{type : "devices/addDevice", payload : {id : 123, name: 'Unnamed device' }}
*/
export const { setDevices, deleteDevice } = actions


