// @flow

/**
  * Enumeration of events, that could be
  * USER_STATE_CHANGE, HUBS_STATE_CHANGE...
  * @readonly
  * @enum {string}
  */
export const EVENTS = Object.freeze({
  USER_STATE_CHANGED: 'USER STATE CHANGED',
  HUBS_LIST_CHANGED: 'HUBS LIST CHANGED',
});
export type EVENTSS_TYPE = $Values<typeof EVENTS>;
