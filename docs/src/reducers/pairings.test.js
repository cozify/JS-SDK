// import { configureStore } from '@reduxjs/toolkit';
// import deepFreeze from 'deep-freeze';
import { pairingsState, pairingsReducer } from './pairings';
import { store } from '../store';
// deepFreeze(state) to test state immutability

describe('Pure pairingsReducer', () => {
  it('should handle initial state', () => {
    expect(pairingsReducer(undefined, {})).toEqual({});
  });
});

describe('Store pairingsReducer', () => {
  it('setDevices and setDevice will add devices', () => {
    const device1 = { id: 111, name: 'testiI' };
    const devices = { hubId: '007', devices: { 111: device1 } };

    store.dispatch(pairingsState.actions.setPairingDevices(devices));
    const stateNow = store.getState();
    const storedDevices = pairingsState.selectors.getPairings(stateNow);

    console.log('Devices', storedDevices);
    expect(storedDevices['007']['111']).toEqual(device1);


    const device2 = { id: '123', name: 'testiII' };
    store.dispatch(pairingsState.actions.setPairingDevice({ hubId: '007', device: device2 }));
    const stateNowII = store.getState();
    const storedDevicesII = pairingsState.selectors.getPairings(stateNowII);

    console.log('Devices II', storedDevicesII);
    expect(storedDevicesII['007']['123']).toEqual(device2);
  });
});
