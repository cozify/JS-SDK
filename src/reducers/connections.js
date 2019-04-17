// @flow

// This actionreducer uses internally https://github.com/mweststrate/immer, so it's safe to modify given state directly
import isEmpty  from 'lodash/isEmpty';
import { createSlice } from 'redux-starter-kit'
import { CLOUD_CONNECTION_STATES } from '../connection/constants.js';
import type { CLOUD_CONNECTION_STATE_TYPE } from '../connection/constants.js';


const connectionsState = createSlice({
  slice: 'connections',
  initialState: {
    cloudState: CLOUD_CONNECTION_STATES.UNCONNECTED
  },
  reducers: {
    setCloudConnectionState(state, action) {
      const newState = action.payload
      const oldState = state.cloudState
      if (Object.values(CLOUD_CONNECTION_STATES).indexOf(newState) > -1) {
        if (oldState !== newState) {
          console.log ("CLOUD connection state " + oldState + " -> " + newState)
          state.cloudState = newState

        }
      }
    },


  }
})


const { actions, reducer } = connectionsState
const connectionsReducer = reducer
// Extract the action creators object
export { connectionsState }
// Export the reducer
export { connectionsReducer }

// Extract and export each action creator by name
export const { setCloudConnectionState } = actions


