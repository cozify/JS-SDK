// @flow

// This actionreducer uses internally https://github.com/mweststrate/immer, so it's safe to modify given state directly
import { createSlice } from 'redux-starter-kit';
import { HUB_CONNECTION_STATES } from '../connection/constants';

/**
 * Hubs action creators object
 * @see  https://github.com/reduxjs/redux-starter-kit/blob/master/docs/api/createSlice.md
 * @return { {
 *   slice : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */
export const hubsState = createSlice({
  slice: 'hubs',
  initialState: {},
  reducers: {
    /*
     * Reducer action of setting many hubs to state
     * @param  {Object} state
     * @param  {payload:{hubs:HUBS_MAP_TYPE}} action
     */
    updateHubs(state, action) {
      const stateToSet = state;
      const hubs = action.payload;
      console.log('updateHubs', hubs);
      Object.entries(hubs).forEach((entry) => {
        const [id, hub] = entry;
        stateToSet[id] = { ...state[id], ...hub };
      });
    },


    /*
     * Reducer action of setting hub state to selected
     * @param  {Object} state
     * @param  {payload:{hubId:string}} action
     */
    selectHub(state, action) {
      const stateToSet = state;
      const { hubId } = action.payload;
      console.log('selectHub', hubId);
      if (state[hubId]) {
        stateToSet[hubId].selected = true;
        console.log('selectHub', state[hubId]);
      }
    },

    /*
     * Reducer action of setting hub state to unselected
     * @param  {Object} state
     * @param  {payload:{hubId:string}} action
     */
    unSelectHub(state, action) {
      const stateToSet = state;
      const { hubId } = action.payload;
      if (state[hubId]) {
        stateToSet[hubId].selected = false;
        // console.log("selectHub", state[action.payload]);
      }
    },

    /*
     * Reducer action of setting hub connection state
     * @param  {Object} state
     * @param  {payload:{hubId:string, state:HUB_STATES_TYPE}} action
     */
    setHubConnectionState(state, action) {
      const { hubId } = action.payload;
      const stateToSet = state;
      const newState = action.payload.state;
      const oldState = state[hubId] ? state[hubId].connectionState : undefined;
      if (Object.values(HUB_CONNECTION_STATES).indexOf(newState) > -1) {
        if (oldState && oldState !== newState) {
          // console.log (`HUB ${hubId} connection state ${oldState} -> ${newState}`);
          stateToSet[hubId].connectionState = newState;
        }
      }
    },
  },
});


// console.log('hubsState ', hubsState)
const { actions, reducer } = hubsState;
const hubsReducer = reducer;

/**
 * Hubs reducer
 * @type {function} reducer
 */
export { reducer as hubsReducer };

// Extract and export each action creator by name
/*
console.log(updateHubs({ id: 123, name: 'Unnamed device' }))
{type : "hubs/updateHubs, payload : {id : 123, name: 'Unnamed device' }}
*/
export const {
  updateHubs, selectHub, unSelectHub, setHubConnectionState,
} = actions;
