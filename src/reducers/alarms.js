
// @flow
import { createSlice, createSelector, createEntityAdapter } from '@reduxjs/toolkit';


/**
 * Alarms action creators object
 * @see  https://github.com/reduxjs/@reduxjs/toolkit/blob/master/docs/api/createSlice.md
 * @return { {
 *   name : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */
export const alarmsState = createSlice({
  name: 'alarms',
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
        const [id, alarm] = entry;
        hubAlarms[id] = { ...alarm };
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

const adapter = createEntityAdapter();
export const {
  selectById: selectAlarmById,
  selectIds: selectAlarmIds,
  selectEntities: selectAlarmEntities,
  selectAll: selectAllAlarms,
  selectTotal: selectTotalAlarms,
} = adapter.getSelectors((state) => state.alarms);

alarmsState.selectors = adapter.getSelectors((state) => state.alarms);
alarmsState.selectors.getAlarms = createSelector(
  [(state) => state.alarms],
  (alarms) => alarms,
);

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
  setAlarms, setAlarm, removeAlarm,
} = actions;
