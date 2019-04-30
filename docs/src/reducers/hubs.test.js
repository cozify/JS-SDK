import { configureStore } from 'redux-starter-kit';
import { hubsState, hubsReducer } from "./hubs";
import {store, watchChanges} from "../store.js"

describe('hubsReducer', () => {
  it('add hubs with action updateHubs', () => {

    const hub1 = {'id': '111', 'name': 'testi'}
    const hub2 = {'id': '123', 'name': 'testiII'}
    const hubs = {'111':hub1, '123': hub2}

    store.dispatch(hubsState.actions.updateHubs(hubs))
    const stateNow = store.getState()
    const storedHubs = hubsState.selectors.getHubs(stateNow)
    //console.log("Stored hubs", storedHubs)

    expect(storedHubs['111']).toEqual(hub1)
    expect(storedHubs['123']).toEqual(hub2)

    store.dispatch(hubsState.actions.selectHub('123'))
    const stateNowII = store.getState()
    const storedHubsII = hubsState.selectors.getHubs(stateNowII)
    console.log("Stored hubs", storedHubsII)
    expect(storedHubsII['123'].selected).toBe(true)
    expect(storedHubsII['111'].selected).not.toBe(true)


  })
})
