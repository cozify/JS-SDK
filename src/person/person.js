// @flow
import { LANGUAGES } from './constants.js';
import type { LANGUAGES_TYPE } from './constants.js';

/*
 *  General person class to be used for current user and all other users
 */
export class Person {
  firstName: string
  lastName: string
  email: string
  language: LANGUAGES_TYPE


  /*
   * Create Person
   * @param  {String} options.firstName - first name
   * @param  {String} options.lastName  - last name
   * @param  {String} options.email     - email address
   * @param  {LANGUAGES_TYPE} options.language  - language
   */
  constructor({ firstName = '', lastName = '', email = '', language = LANGUAGES.NONE }: {firstName?: string, lastName?: string, email?: string, language?: LANGUAGES_TYPE} = {}) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.language = language;
  }

  toString(): string {
    return `Person ${this.firstName}  ${this.lastName}. Language: ${this.language}. Email: ${this.language}`;
  }

  print() {
    console.log(this.toString());
  }
}
