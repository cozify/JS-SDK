// import { configureStore } from 'redux-starter-kit';
import { userState } from './user';
import { USER_STATES, LANGUAGES } from '../user/constants';
import { changeLanguage } from '../user/user';
import { store, watchChanges } from '../store';

describe('hubTokensReducer', () => {
  it('user language is changed with changeLanguage', () => {
    // just temp store for test
    // const store = configureStore({reducer: {user: userReducer}});

    changeLanguage(LANGUAGES.FI_FI);

    const stateNowI = store.getState();
    // console.log("I State user", stateNowI)

    const storedUser = userState.selectors.getUser(stateNowI);
    expect(storedUser.state).toBe(USER_STATES.WAITING_LOGIN);

    // doPwLogin( "test", "test" )

    const stateNowII = store.getState();
    const storedUserII = userState.selectors.getUser(stateNowII);
    // console.log("II State user", stateNowII)

    /**
     * Listener of User state changes
     */
    watchChanges('user.state', (newState) => {
      // Start discovery when user is authenticated
      if (newState === USER_STATES.AUTHENTICATED) {
        CozifySDK.fetchHubTokens(storedUserII.authKey);
      }
    }, store);

    // expect(storedUser.state).toEqual()
  });
});
