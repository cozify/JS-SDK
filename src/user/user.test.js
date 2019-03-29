
import { LANGUAGES } from '../person/constants.js';
import { USER_STATES, ROLES } from './constants.js';
import { user} from './user.js';

/** @test {user} */
describe('user after creation', () => {
  it('is initialized', () => {
    const expectedUser = {
      authKey: '',
      email: '',
      firstName: '',
      language: 'none',
      lastName: '',
      role: 1
    };
    expect(user).toEqual(expectedUser);
  });

  it('name is initialized', () => {
    user.firstName = 'A';
    user.lastName = 'B';
    const expectedUser = {
      authKey: '',
      email: '',
      firstName: 'A',
      language: 'none',
      lastName: 'B',
      role: 1
    };
    expect(user).toEqual(expectedUser);
  });

  it('language is set', () => {
    user.language = LANGUAGES.FI_FI;
    const expectedUser = {
      authKey: '',
      email: '',
      firstName: 'A',
      language: 'fi-fi',
      lastName: 'B',
      role: 1,
    };
    expect(user).toEqual(expectedUser);
  });

  it('Language is changed', () => {
    user.changeLanguage(LANGUAGES.FI_FI);
    expect(user.language).toBe(LANGUAGES.FI_FI);
  });

  it('State is changed ', () => {
    expect(user.getState()).toBe(USER_STATES.WAITING_LOGIN);
  });
});

describe('user login', () => {
  it('failed login', () => {
    expect(user.getState()).toBe(USER_STATES.WAITING_LOGIN);
  });
});
