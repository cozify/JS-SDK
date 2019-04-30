// 

// This actionreducer uses internally https://github.com/mweststrate/immer, so it's safe to modify given state directly
import isEmpty  from 'lodash/isEmpty';
import { createSlice } from 'redux-starter-kit'
import { CLOUD_CONNECTION_STATES } from '../connection/constants.js';


/**
 * Connections action creators object
 * @see  https://github.com/reduxjs/redux-starter-kit/blob/master/docs/api/createSlice.md
 * @return { {
 *   slice : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */
export const connectionsState = createSlice({
  slice: 'connections',
  initialState: {
    cloudState: CLOUD_CONNECTION_STATES.UNCONNECTED
  },
  reducers: {
    /*
     * Reducer action of cloud connection state
     * @param {Object} state
     * @param {CLOUD_CONNECTION_STATES} action
     */
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
/**
 * Connections reducer
 * @type {function} reducer
 */
export {reducer as connectionsReducer}

// Extract and export each action creator by name
export const { setCloudConnectionState } = actions


