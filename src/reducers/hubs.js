// @flow

// This actionreducer uses internally https://github.com/mweststrate/immer, so it's safe to modify given state directly
import { createSlice } from 'redux-starter-kit'
import { HUB_CONNECTION_STATES } from '../hubs/constants.js';
import type { HUB_CONNECTION_STATE_TYPES } from '../hubs/constants.js';

const hubsState = createSlice({
  slice: 'hubs',
  initialState: {},
  reducers: {
    /**
     * Sets hub information from hub-tokens to state
     * @param  {[type]} state  [description]
     * @param  {[type]} action [description]
     * @return {[type]}        [description]
     */
    updateHubs(state, action) {
      for (const [id, hub] of Object.entries(action.payload)) {
        state[id] = {...state[id], ...hub};
      }
    },


    selectHub(state, action) {
      if (state[action.payload]) {
        state[action.payload].selected = true;
        //console.log("selectHub", state[action.payload]);
      }
    },

    unSelectHub(state, action) {
      if (state[action.payload]) {
        state[action.payload].selected = false;
        //console.log("selectHub", state[action.payload]);
      }
    },

    setHubConnectionState(state, action) {
      const hubId = action.payload.hubId
      const newState = action.payload.state
      const oldState = state[hubId].connectionState
      if (Object.values(HUB_CONNECTION_STATES).indexOf(newState) > -1) {
        if (oldState !== newState) {
          console.log (`HUB ${hubId} connection state ${oldState} -> ${newState}`);
          state[hubId].connectionState = newState;
          events.emit(EVENTS.HUB_CONNECTION_STATE_CHANGED, newState);
        }
      }
    }
  }
})


//console.log('hubsState ', hubsState)
const { actions, reducer } = hubsState
const hubsReducer = reducer
// Extract the action creators object
export {hubsState}
// Export the reducer
export {hubsReducer}
// Extract and export each action creator by name
/*
console.log(updateHubs({ id: 123, name: 'Unnamed device' }))
{type : "hubs/updateHubs, payload : {id : 123, name: 'Unnamed device' }}
*/
export const { updateHubs, selectHub, unSelectHub, setHubConnectionState } = actions

