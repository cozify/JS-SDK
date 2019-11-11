
// 

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
export const alarmsState = createSlice({
  slice: 'alarms',
  initialState: {},
  reducers: {

    /*
     * Reducer action of setting alarms state - sets all given alarms of given hub, keeps existing states
     * @param {Object} state
     * @param {Object} action
     */
    setAlarms(state, action) {
      const stateToSet = state;
      const { hubId } = action.payload;
      const { alarms } = action.payload;
      const hubAlarms = {};


      Object.entries(alarms).forEach((entry) => {
        const [id, room] = entry;
        hubAlarms[id] = { ...room };
      });
      stateToSet[hubId] = { ...hubAlarms };
    },


    /*
     * Reducer action of set alarm state
     * @param {Object} state
     * @param {Object} action
     */
    setAlarm(state, action) {
      const stateToSet = state;
      const { hubId } = action.payload;
      const { alarm } = action.payload;
      if (hubId && stateToSet[hubId]) {
        stateToSet[hubId][alarm.id] = { ...alarm };
      }
    },

    /*
     * Reducer action of removing alarm state
     * @param {Object} state
     * @param {Object} action
     */
    removeAlarm(state, action) {
      const stateToSet = state;
      const { hubId } = action.payload;
      const { alarmId } = action.payload;
      if (hubId && alarmId && stateToSet[hubId] && stateToSet[hubId][alarmId]) {
        delete stateToSet[hubId][alarmId];
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

const { actions, reducer } = alarmsState;

/**
 * Devices reducer
 * @type {function} reducer
 */
export { reducer as alarmsReducer };

// Extract and export each action creator by name
/*
console.log(addDevice({ id: 123, name: 'Unnamed device' }))
{type : "devices/addDevice", payload : {id : 123, name: 'Unnamed device' }}
*/
export const {
  setAlarms, addAlarm, deleteAlarm, removeAlarm,
} = actions;
