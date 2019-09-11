
const CozifySDK = require('../dist/sdk-node.js');
console.log('Testing Cozify SDK from node.js')

let fixedUsername = '...@cozify.fi'
let fixedPassword = 'xxx'
let fixedHubId = 'xxxx-xxxx'
let fixedDeviceId = 'abcd-efgh'


let LANGUAGES = CozifySDK.LANGUAGES;
let USER_STATES = CozifySDK.USER_STATES;

console.info(`Initial user state ${CozifySDK.getUserState()}`);
console.info(`--1--`);

CozifySDK.changeLanguage(LANGUAGES.FI_FI);
console.info(`--2--`);


CozifySDK.doPwLogin( fixedUsername, fixedPassword )
  .then((response) => {
    CozifySDK.acceptEula();
    console.info(`--3--`);

    //CozifySDK.doLogout();
    //console.info(`--4--`);

  })
  .catch(function (error) {
    console.info(`Pw failure when user state ${CozifySDK.getCloudConnectionState()}`, error);
  })


/** Listener for specific changes */
CozifySDK.watchChanges('connections.cloudState', (newState, oldState) => {
  console.log('connections.cloudState changed from %s to %s', oldState, newState);
});

CozifySDK.watchChanges('user.state', (newState, oldState) => {
  console.log('user.state changed from %s to %s', oldState, newState);
});

CozifySDK.watchChanges('hubs', (newHubsState, oldHubsState) => {
  if (newHubsState[fixedHubId] && !newHubsState[fixedHubId].selected) {
    CozifySDK.selectHubById(fixedHubId);

    setTimeout(function() {
      CozifySDK.unSelectHubById(fixedHubId);
    }, 10000);

  };

  if (newHubsState[fixedHubId] && oldHubsState[fixedHubId]){
    if (newHubsState[fixedHubId].connectionState !== oldHubsState[fixedHubId].connectionState) {
      console.log('Hub connectionState changed from %s to %s', oldHubsState[fixedHubId].connectionState, newHubsState[fixedHubId].connectionState);
    }
  }

});

let deviceStateChanged = false;
CozifySDK.watchChanges('devices', (newDevicesState, oldDevicesState) => {
  if ( newDevicesState[fixedHubId] && newDevicesState[fixedHubId][fixedDeviceId] && newDevicesState[fixedHubId][fixedDeviceId].state ) {
    if (!deviceStateChanged) {
      deviceStateChanged = true;
      let state = newDevicesState[fixedHubId][fixedDeviceId].state;
      state.isOn = !state.isOn;
      CozifySDK.sendDeviceCmd(fixedHubId, fixedDeviceId, state, ['isOn', 'type']);
    }
  }
});


/** Listener for store changes like React will internally do */
CozifySDK.store.subscribe(() => {
  const storeNow = CozifySDK.store.getState()
  console.info("Hub connection:", CozifySDK.getHubConnectionState(fixedHubId));
  //console.info("Hubs", storeNow.hubs)
  console.info("Devices:", JSON.stringify(CozifySDK.getDevices()[fixedHubId]));
})
