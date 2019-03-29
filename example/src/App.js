import React, { Component } from 'react'

import {ExampleComponent} from './component.js'

// ---- Coz part

import {LANGUAGES} from 'cozify-sdk'
import { USER_STATES } from 'cozify-sdk'
//import { HUB_STATES } from 'cozify-sdk'
import {events} from 'cozify-sdk'
import { EVENTS } from 'cozify-sdk'
import { user } from 'cozify-sdk'
import { fetchHubTokens, getHubs } from 'cozify-sdk'
import { state } from 'cozify-sdk'

// Fill them as should
let fixedUsername = ''
let fixedPassword = ''

console.log(events);
console.log(`Initial connection state now ${state.connectionState}`);
console.log(`Initial user state ${user.getState()}`);
console.log(`--1--`);

user.changeLanguage(LANGUAGES.FI_FI);
console.log(`--2--`);


user.doPwLogin( fixedUsername, fixedPassword )
  .then((response) => {
    user.acceptEula();
    console.log(`--3--`);


    //CozifySDK.user.doLogout();
    //console.log(`--4--`);

  })
  .catch(function (error) {
    console.log(`User state ${user.getState()}`);
  })



/**
 * Listener of User state changes
 */
//const unbindUserStateChangedListener = events.on(EVENTS.USER_STATE_CHANGED, state => {
events.on(EVENTS.USER_STATE_CHANGED, state => {
  console.log("USER_STATE CHANGED: ", state);
  if (state === USER_STATES.AUTHENTICATED) {
    fetchHubTokens(user.authKey);
  }
});


/**
 * Listener of HUB list changes
 */
//const unbindHubListCahngeListener = events.on(EVENTS.HUBS_LIST_CHANGED, eventHubs => {
events.on(EVENTS.HUBS_LIST_CHANGED, eventHubs => {
  const hubs = getHubs(); // Optional because eventHubs contains same info
  for (let key in hubs) {
    console.log(` Hub name: ${hubs[key].name} - role: ${hubs[key].roleString}`);
  }
});


// ---- Coz part
//
let text = 'React component test SDK: '

export default class App extends Component {

  render () {
    return (
      <div>
        <ExampleComponent text={text} />
      </div>
    )
  }
}
