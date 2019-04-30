import React, { Component } from 'react'

import {ExampleComponent} from './component.js'

// ---- Coz part

import { store, LANGUAGES, USER_STATES, getUserState, changeLanguage, doPwLogin, acceptEula, watchChanges, selectHubById, getHubConnectionState, getDevices } from 'cozify-sdk'


// Fill them as should
let fixedUsername = '...@cozify.fi'
let fixedPassword = 'xxx'
let fixedHubId = 'xxxx-xxxx'
let fixedDeviceId = 'abcd-efgh'


console.info(`Initial user state ${getUserState()}`);
console.info(`--1--`);

changeLanguage(LANGUAGES.FI_FI);
console.info(`--2--`);


doPwLogin( fixedUsername, fixedPassword )
.then((response) => {
  acceptEula();
  console.log(`--3--`);


  //CozifySDK.user.doLogout();
  //console.log(`--4--`);

})
.catch(function (error) {
  console.log(`User state in error!`);
})

watchChanges('hubs', (newHubsState, oldHubsState) => {
  if (newHubsState[fixedHubId] && !newHubsState[fixedHubId].selected) {
    selectHubById(fixedHubId);
    /*
    setTimeout(function() {
      CozifySDK.unSelectHubById(fixedHubId);
    }, 10000);
    */
  };

  if (newHubsState[fixedHubId] && oldHubsState[fixedHubId]){
    if (newHubsState[fixedHubId].connectionState !== oldHubsState[fixedHubId].connectionState) {
      console.log('Hub connectionState changed from %s to %s', oldHubsState[fixedHubId].connectionState, newHubsState[fixedHubId].connectionState);
    }
  }

});

/** Listener for store changes like React will internally do */
store.subscribe(() => {
  const storeNow = store.getState()
  //console.info("Hub connection:", getHubConnectionState(fixedHubId));
  //console.info("Hubs", storeNow.hubs)
  console.info("Devices:", JSON.stringify(getDevices()[fixedHubId]));
})


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
