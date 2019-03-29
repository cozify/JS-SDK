
const CozifySDK = require('../dist/sdk-node.js');
console.log('Testing Cozify SDK from node.js')

let fixedUsername = ''
let fixedPassword = ''

let state = CozifySDK.state;
let user = CozifySDK.user;
let LANGUAGES = CozifySDK.LANGUAGES;
let events = CozifySDK.events;
let EVENTS = CozifySDK.EVENTS;
let USER_STATES = CozifySDK.USER_STATES;

console.log(`Initial connection state now ${state.connectionState}`);
console.log(`Initial user state ${user.getState()}`);
console.log(`--1--`);

user.changeLanguage(LANGUAGES.FI_FI);
console.log(`--2--`);



user.doPwLogin( fixedUsername, fixedPassword )
  .then((response) => {
    user.acceptEula();
    console.log(`--3--`);

    //user.doLogout();
    //console.log(`-----`);

  })
  .catch(function (error) {
    console.log(`User state ${user.getState()}`);
  })



/**
 * Listener of User state changes
 */
const unbindUserStateChangedListener = events.on(EVENTS.USER_STATE_CHANGED, state => {
  console.log("USER_STATE CHANGED: ", state);
  if (state === USER_STATES.AUTHENTICATED){
    CozifySDK.fetchHubTokens(user.authKey);
  }
});


/**
 * Listener of HUB list changes
 */
const unbindHubListCahngeListener = events.on(EVENTS.HUBS_LIST_CHANGED, eventHubs => {
  const hubs = CozifySDK.getHubs(); // Optional because eventHubs contains same info
  for (let key in hubs) {
    console.log(` Hub name: ${hubs[key].name} - role: ${hubs[key].roleString}`);
  }
});

