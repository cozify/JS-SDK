// @flow

// This actionreducer uses internally https://github.com/mweststrate/immer, so it's safe to modify given state directly
import { createSlice } from 'redux-starter-kit'
import { LANGUAGES, USER_STATES, ROLES } from '../user/constants.js';
import type { USER_STATE_TYPE, ROLES_TYPE } from '../user/constants.js';
import type { LANGUAGES_TYPE } from '../user/constants.js';
import isEmpty  from 'lodash/isEmpty';


/**
 * User action creators object
 * @see  https://github.com/reduxjs/redux-starter-kit/blob/master/docs/api/createSlice.md
 * @return { {
 *   slice : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */
export const userState = createSlice({
  slice: 'user',
  initialState: {
    firstName: '',
    lastName: '',
    email: '',
    language: LANGUAGES.NONE,
    authKey: '',
    role: ROLES.ANONYMOUS,
    eulaAccepted: false,
    state: USER_STATES.WAITING_LANGUAGE
  },
  reducers: {
    /*
     * Reducer action of setting user's state
     * @param  {Object} state
     * @param  {payload:{state:USER_STATE_TYPE}} action
     */
    changeState(state, action) {
      const newState = action.payload
      const oldState = state.state
      console.log ("User state " + oldState + " -> " + newState)
      switch (oldState) {
        case USER_STATES.WAITING_LANGUAGE: {
          if (newState === USER_STATES.LANGUAGE_SET) {
            if (!isEmpty(state.language)) {
              state.state = USER_STATES.WAITING_LOGIN;
            }
          }
          break;
        }
        case USER_STATES.WAITING_LOGIN: {
          if (newState === USER_STATES.LOGIN_DONE) {
            if (!isEmpty(state.authKey)) {
              if (isEmpty(state.eulaAcceted)) {
                state.state = USER_STATES.WAITING_EULA;
              } else {
                state.state = USER_STATES.AUTHENTICATED;
              }
            }
          }
          break;
        }
        case USER_STATES.WAITING_EULA: {
          if (newState === USER_STATES.EULA_ACCEPTED) {
            state.state = USER_STATES.AUTHENTICATED;
          }
          break;
        }
        case USER_STATES.AUTHENTICATED: {
          if (newState === USER_STATES.LOGGED_OUT) {
            state.state = USER_STATES.WAITING_LOGIN;
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
      state.eulaAccepted = action.payload
    },

    /*
     * Reducer action of setting user's language
     * @param  {Object} state
     * @param  {payload:LANGUAGES_TYPE} action
     */
    setLanguage(state, action) {
      state.language = action.payload
    },

    /*
     * Reducer action of setting user's authKey
     * @param  {Object} state
     * @param  {payload:string} action
     */
    setAuthKey(state, action) {
      state.authKey = action.payload
    }

  }
})

/*
console.log(user)
{
    actions : {
        setState
    },
    reducer
}
*/


const { actions, reducer } = userState
const userReducer = reducer

/**
 * Hubs reducer
 * @type {function} reducer
 */
export {reducer as userReducer}


// Extract and export each action creator by name
export const { changeState, setEula, setLanguage, setAuthKey } = actions


