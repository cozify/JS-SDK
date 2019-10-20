// @flow


/**
  * Enumeration of language, that could be
  * NONE, EN_UK or FI_FI
  * @readonly
  * @enum {string}
  */
export const LANGUAGES = Object.freeze({
  NONE: 'none',
  EN_UK: 'en-uk',
  FI_FI: 'fi-fi',
});
export type LANGUAGES_TYPE = $Values<typeof LANGUAGES>;


/**
  * Enumeration of user state, that could be
  * WAITING_LANGUAGE, LANGUAGE_SET, WAITING_LOGIN, LOGIN_DONE, WAITING_EULA, EULA_ACCEPTED, AUTHENTICATED or LOGGED_OUT
  * @readonly
  * @enum {string}
  */
export const USER_STATES = Object.freeze({
  WAITING_LANGUAGE: 'wait language',
  LANGUAGE_SET: 'language set',
  WAITING_LOGIN: 'wait login',
  LOGIN_DONE: 'login done',
  WAITING_EULA: 'wait eula',
  EULA_ACCEPTED: 'eula accepted',
  AUTHENTICATED: 'logged in',
  KEYED: 'key entered',
  LOGGED_OUT: 'logged out',
});
export type USER_STATE_TYPE = $Values<typeof USER_STATES>;


/**
  * Enumeration of ROLES, that could be
  * ADMIN, USER, GUEST or ANONYMOUS
  * @readonly
  * @enum {string}
  */
export const ROLES = Object.freeze({
  ADMIN: 32,
  USER: 8,
  GUEST: 2,
  ANONYMOUS: 1,
});
export type ROLES_TYPE = $Values<typeof ROLES>;
