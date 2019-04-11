import { configureStore } from 'redux-starter-kit';
import { userState, userReducer } from "./user";
import { USER_STATES, ROLES, LANGUAGES } from '../user/constants.js';
import {changeLanguage, doPwLogin} from "../user/user"
import {initStore} from "../store.js"
import { events } from '../events/events.js'
import { EVENTS } from '../events/constants.js'

describe('hubTokensReducer', () => {
  it('user language is changed with changeLanguage', () => {

    // just temp store for test
    const store = configureStore({reducer: {user: userReducer}});
    initStore(store);

    changeLanguage(LANGUAGES.FI_FI)

    const stateNowI = store.getState()
    //console.log("I State user", stateNowI)

    const storedUser = userState.selectors.getUser(stateNowI)
    expect(storedUser.state).toBe(USER_STATES.WAITING_LOGIN)

    //doPwLogin( "test", "test" )

    const stateNowII = store.getState()
    const storedUserII = userState.selectors.getUser(stateNowII)
    //console.log("II State user", stateNowII)

    const unbindUserStateChangedListener = events.on(EVENTS.USER_STATE_CHANGED, newState => {
      console.log("USER_STATE CHANGED: ", newState);
      if (newState === USER_STATES.AUTHENTICATED){
        CozifySDK.fetchHubTokens(storedUserII.authKey);
      }
    });
    //expect(storedUser.state).toEqual()

  })
})
