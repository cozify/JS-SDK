// import { configureStore } from 'redux-starter-kit';
import {
  userState, userReducer, setAuthKey, changeState,
} from './user';
import { USER_STATES, LANGUAGES, ROLES } from '../user/constants';
import { changeLanguage } from '../user/user';
import { store } from '../store';

describe('Pure userReducer', () => {
  it('should handle initial state', () => {
    expect(userReducer(undefined, {})).toEqual({
      firstName: '',
      lastName: '',
      email: '',
      language: LANGUAGES.NONE,
      authKey: '',
      role: ROLES.ANONYMOUS,
      eulaAccepted: false,
      state: USER_STATES.WAITING_LANGUAGE,
    });
  });
});


describe('Store userReducer', () => {
  it('user language is changed with changeLanguage', () => {
    // just temp store for test
    // const store = configureStore({reducer: {user: userReducer}});

    changeLanguage(LANGUAGES.FI_FI);

    const stateNowI = store.getState();
    // console.log('I State user', stateNowI);

    const storedUser = userState.selectors.getUser(stateNowI);
    expect(storedUser.state).toBe(USER_STATES.WAITING_LOGIN);


    store.dispatch(setAuthKey('123'));
    expect(storedUser.state).toBe(USER_STATES.WAITING_LOGIN);

    store.dispatch(changeState(USER_STATES.LOGIN_DONE));
    const stateNowII = store.getState();
    const storedUserII = userState.selectors.getUser(stateNowII);
    expect(storedUserII.state).toBe(USER_STATES.WAITING_EULA);
    // console.log('II State user', stateNowII);

    store.dispatch(changeState(USER_STATES.EULA_ACCEPTED));
    const storedUserIII = userState.selectors.getUser(store.getState());
    expect(storedUserIII.state).toBe(USER_STATES.AUTHENTICATED);
    // console.log('III State user', storedUserIII);

    store.dispatch(changeState(USER_STATES.LOGGED_OUT));
    const storedUserIV = userState.selectors.getUser(store.getState());
    expect(storedUserIV.state).toBe(USER_STATES.WAITING_LOGIN);
    // console.log('IV State user', storedUserIV);

    /**
     * Listener of User state changes.. would be nice to have test like
    watchChanges('user.state', (newState) => {
      console.log('user.state changes', newState);
      // Start discovery when user is authenticated
      if (newState === USER_STATES.AUTHENTICATED) {
        CozifySDK.fetchHubTokens(storedUserII.authKey);
      }
    }, store);
    expect(storedUser.state).toEqual()
     */

  });
});
