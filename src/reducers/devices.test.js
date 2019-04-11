import { configureStore } from 'redux-starter-kit';
import { devicesState, devicesReducer, setDevices, deleteDevice } from "./devices";

import deepFreeze from 'deep-freeze'
// deepFreeze(state) to test state immutability

describe('devicesReducer', () => {
  it('returns new device with action addDevice', () => {

    const store = configureStore({reducer: {devices: devicesReducer}});
    const device1 = {id: 111, name: 'testi'}
    const devices = {'111': device1}
    store.dispatch(setDevices(devices))
    const stateNow = store.getState()
    const storedDevices = devicesState.selectors.getDevices(stateNow)

    console.log("Devices", storedDevices)
    expect(storedDevices['111']).toEqual(device1)

    const device2 = {id: '123', name: 'testi'}
    store.dispatch(devicesState.actions.setDevices({'123': device2}))
    const stateNowII = store.getState()
    const storedDevicesII = devicesState.selectors.getDevices(stateNowII)

    console.log("Devices II", storedDevicesII)
    expect(storedDevicesII['123']).toEqual(device2)

  })
})
