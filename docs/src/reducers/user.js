// 

import { createSlice, createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import isEmpty from 'lodash/isEmpty';
import { LANGUAGES, USER_STATES, ROLES } from '../user/constants';


/**
 * User action creators object
 * @see  https://github.com/reduxjs/@reduxjs/toolkit/blob/master/docs/api/createSlice.md
 * @return { {
 *   slice : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */
export const userState = createSlice({
  name: 'user',
  initialState: {
    firstName: '',
    lastName: '',
    email: '',
    language: LANGUAGES.NONE,
    authKey: '',
    role: ROLES.ANONYMOUS,
    eulaAccepted: false,
    state: USER_STATES.WAITING_LANGUAGE,
  },
  reducers: {
    /*
     * Reducer action of setting user's state
     * @param  {Object} state
     * @param  {payload:{state:USER_STATE_TYPE}} action
     */
    changeState(state, action) {
      const stateToSet = state;
      const newState = action.payload;
      const oldState = state.state;
      console.log(`User state ${oldState} -> ${newState}`);
      switch (oldState) {
        case USER_STATES.WAITING_LANGUAGE: {
          if (newState === USER_STATES.LANGUAGE_SET) {
            if (!isEmpty(state.language)) {
              stateToSet.state = USER_STATES.WAITING_LOGIN;
            }
          }
          break;
        }
        case USER_STATES.WAITING_LOGIN: {
          if (newState === USER_STATES.LOGIN_DONE) {
            if (!isEmpty(state.authKey)) {
              if (isEmpty(state.eulaAcceted)) {
                stateToSet.state = USER_STATES.WAITING_EULA;
              } else {
                stateToSet.state = USER_STATES.AUTHENTICATED;
              }
            }
          }
          break;
        }
        case USER_STATES.WAITING_EULA: {
          if (newState === USER_STATES.EULA_ACCEPTED) {
            stateToSet.state = USER_STATES.AUTHENTICATED;
          }
          break;
        }
        case USER_STATES.AUTHENTICATED: {
          if (newState === USER_STATES.LOGGED_OUT) {
            stateToSet.state = USER_STATES.WAITING_LOGIN;
          }
          break;
        }
        default: {
          // statements;
          break;
        }
      }
    },


    /*
     * Reducer action of setting user's eula to accepted
     * @param  {Object} state
     * @param  {payload:boolean} action
     */
    setEula(state, action) {
      const stateToSet = state;
      stateToSet.eulaAccepted = action.payload;
    },

    /*
     * Reducer action of setting user's language
     * @param  {Object} state
     * @param  {payload:LANGUAGES_TYPE} action
     */
    setLanguage(state, action) {
      const stateToSet = state;
      stateToSet.language = action.payload;
    },

    /*
     * Reducer action of setting user's authKey
     * @param  {Object} state
     * @param  {payload:string} action
     */
    setAuthKey(state, action) {
      const stateToSet = state;
      stateToSet.authKey = action.payload;
    },

    /*
     * Reducer action of setting user's authKey and state
     * @param  {Object} state
     * @param  {payload:{state:USER_STATE_TYPE}} action
     */
    setAuthenticated(state, action) {
      const stateToSet = state;
      stateToSet.authKey = action.payload;
      stateToSet.state = USER_STATES.KEYED;
    },

  },
});

/*
console.log(user)
{
    actions : {
        setState
    },
    reducer
}
*/

const adapter = createEntityAdapter();
userState.selectors = adapter.getSelectors((state) => state.user);
userState.selectors.getUser = createSelector(
  [(state) => state.user],
  (user) => user,
);

const { actions, reducer } = userState;

/**
 * Hubs reducer
 * @type {function} reducer
 */
export { reducer as userReducer };


// Extract and export each action creator by name
export const {
  changeState, setEula, setLanguage, setAuthKey,
} = actions;
