// import { configureStore } from 'redux-starter-kit';
// import deepFreeze from 'deep-freeze';
import { devicesState } from './devices';
import { store } from '../store';
// deepFreeze(state) to test state immutability

describe('devicesReducer', () => {
  it('setDevices and setDevice will add devices', () => {
    const device1 = { id: 111, name: 'testiI' };
    const devices = { hubId: '007', devices: { 111: device1 } };

    store.dispatch(devicesState.actions.setDevices(devices));
    const stateNow = store.getState();
    const storedDevices = devicesState.selectors.getDevices(stateNow);

    console.log('Devices', storedDevices);
    expect(storedDevices['007']['111']).toEqual(device1);


    const device2 = { id: '123', name: 'testiII' };
    store.dispatch(devicesState.actions.setDevice({ hubId: '007', device: device2 }));
    const stateNowII = store.getState();
    const storedDevicesII = devicesState.selectors.getDevices(stateNowII);

    console.log('Devices II', storedDevicesII);
    expect(storedDevicesII['007']['123']).toEqual(device2);
  });
});
