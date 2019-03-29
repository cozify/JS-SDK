// @flow
import isEmpty  from 'lodash/isEmpty';
import isString from 'lodash/isString';
import { events } from '../events/events.js'
import { EVENTS } from '../events/constants.js'

import { Person } from '../person/person.js';
import {send, COMMANDS} from '../connection/send.js'

import { LANGUAGES } from '../person/constants.js';
import type { LANGUAGES_TYPE } from '../person/constants.js';

import { USER_STATES, ROLES } from './constants.js';
import type { USER_STATE_TYPE, ROLES_TYPE } from './constants.js';


let _state: USER_STATE_TYPE = USER_STATES.WAITING_LANGUAGE

/**
 * User Class
 */
class User extends Person {
  authKey: string
  role: ROLES_TYPE
  password: string
  eulaAcceted: boolean
  /**
   * Create User
   *
   * @param  {String} options.firstName
   * @param  {String} options.lastName
   * @param  {String} options.email
   * @param  {LANGUAGES_TYPE} options.language
   * @param  {String} options.authKey     Atuhentication key for cloud access
   * @param  {[ROLES_TYPE} options.role   Role
   * @param  {boolen} options.eulaAcceted True when EULA is accepted
   */
  constructor({
    firstName = '', lastName = '', email = '', language = LANGUAGES.NONE, authKey = '', role = ROLES.ANONYMOUS, eulaAcceted =false
  }: {firstName: string, lastName: string, email: string, language: LANGUAGES_TYPE, authKey: string, role: ROLES_TYPE, password:string, eulaAcceted:boolean} = {}) {
    super({
      firstName, lastName, email, language,
    });
    this.authKey = authKey;
    this.role = role;

  }

  getState(): USER_STATE_TYPE {
    return _state;
  }


  changeLanguage(newLanguage: LANGUAGES_TYPE): boolean {
    let retVel = false
    if (Object.values(LANGUAGES).indexOf(newLanguage) > -1) {
      this.language = newLanguage;
      if (_state === USER_STATES.WAITING_LANGUAGE) {
        this.setState(USER_STATES.LANGUAGE_SET);
      }
      retVel = true;
    }
    return retVel;
  }

  acceptEula(): boolean {
    let retVel = false
      this.eulaAcceted = true;
      if (_state === USER_STATES.WAITING_EULA) {
        this.setState(USER_STATES.EULA_ACCEPTED);
      }
      retVel = true;

    return retVel;
  }

  doPwLogin(email: string, password: string): Promise<Object> {
    return new Promise( (resolve, reject) => {
      send( {command: COMMANDS.USER_LOGIN,  data:{email:email, password:password} })
        .then((response) => {
          if (response && isString(response)) {
            this.authKey = response;
            if (_state === USER_STATES.WAITING_LOGIN) {
              this.setState(USER_STATES.LOGIN_DONE);
            }
          }
          resolve(response);
        })
        .catch((error) => {
          //console.error(error);
          reject(false)
        });

    });
  }

  doLogout(): boolean {
    let retVel = false
      if (_state === USER_STATES.AUTHENTICATED) {
        this.authKey = '';
        this.setState(USER_STATES.LOGGED_OUT);
      }
      retVel = true;

    return retVel;
  }

  setState(newState: USER_STATE_TYPE): USER_STATE_TYPE {
    const oldState = _state
    switch (_state) {
      case USER_STATES.WAITING_LANGUAGE: {
        if (newState === USER_STATES.LANGUAGE_SET) {
          if (!isEmpty(this.language)) {
            _state = USER_STATES.WAITING_LOGIN;
          }
        }
        break;
      }
      case USER_STATES.WAITING_LOGIN: {
        if (newState === USER_STATES.LOGIN_DONE) {
          if (!isEmpty(this.authKey)) {
            if (isEmpty(this.eulaAcceted)) {
              _state = USER_STATES.WAITING_EULA;

            } else {
              _state = USER_STATES.AUTHENTICATED;
            }
          }
        }
        break;
      }
      case USER_STATES.WAITING_EULA: {
        if (newState === USER_STATES.EULA_ACCEPTED) {
          _state = USER_STATES.AUTHENTICATED;
        }
        break;
      }
      case USER_STATES.AUTHENTICATED: {
        if (newState === USER_STATES.LOGGED_OUT) {
          _state = USER_STATES.WAITING_LOGIN;
        }
        break;
      }
      default: {
        // statements;
        break;
      }
    }
    if (oldState !== _state) {
      events.emit(EVENTS.USER_STATE_CHANGED, _state);
    }
    return _state;
  }
}


/**
 * Singleton current user of the application
 * @type {User}
 */
export const user = new User();
