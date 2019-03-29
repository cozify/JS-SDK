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
