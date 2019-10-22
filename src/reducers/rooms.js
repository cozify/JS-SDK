
// @flow

// This actionreducer uses internally https://github.com/mweststrate/immer, so it's safe to modify given state directly
import { createSlice } from 'redux-starter-kit';


/**
 * Rooms action creators object
 * @see  https://github.com/reduxjs/redux-starter-kit/blob/master/docs/api/createSlice.md
 * @return { {
 *   slice : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */
export const roomsState = createSlice({
  slice: 'rooms',
  initialState: {},
  reducers: {

    /*
     * Reducer action of setting rooms state - sets all given rooms of given hub, keeps existing states
     * @param {Object} state
     * @param {Object} action
     */
    setRooms(state, action) {
      const stateToSet = state;
      const { hubId } = action.payload;
      const { rooms } = action.payload;
      const hubRooms = {};


      Object.entries(rooms).forEach((entry) => {
        const [id, room] = entry;
        hubRooms[id] = { ...room };
      });
      stateToSet[hubId] = { ...hubRooms };
    },


    /*
     * Reducer action of set room state
     * @param {Object} state
     * @param {Object} action
     */
    setRoom(state, action) {
      const stateToSet = state;
      const { hubId } = action.payload;
      const { room } = action.payload;

      if (hubId && stateToSet[hubId]) {
        stateToSet[hubId][room.id] = { ...room };
      }
    },

    /*
     * Reducer action of removing room state
     * @param {Object} state
     * @param {Object} action
     */
    removeRoom(state, action) {
      const stateToSet = state;
      const { hubId } = action.payload;
      const { roomId } = action.payload;
      if (hubId && roomId && stateToSet[hubId] && stateToSet[hubId][roomId]) {
        delete stateToSet[hubId][roomId];
      }
    },

    /*
     * Reducer action of updating room state
     * @param {Object} state
     * @param {Object} action
     */
    editRoom(state, action) {
      const stateToSet = state;
      const { hubId } = action.payload;
      const { room } = action.payload;
      if (stateToSet[hubId]) {
        stateToSet[hubId][room.id] = { ...room };
      }
    },

  },
});

/*
todos.selectors.getCompletedTodoCount = createSelector(
  [todos.selectors.getTodos],
  todos =>
    todos.reduce((count, todo) => (todo.completed ? count + 1 : count), 0)
);
*/

const { actions, reducer } = roomsState;

/**
 * Devices reducer
 * @type {function} reducer
 */
export { reducer as roomsReducer };

// Extract and export each action creator by name
/*
console.log(addDevice({ id: 123, name: 'Unnamed device' }))
{type : "devices/addDevice", payload : {id : 123, name: 'Unnamed device' }}
*/
export const {
  setRooms, addRoom, deleteRoom, removeRoom,
} = actions;
