/** @test {connections} */
import { CLOUD_CONNECTION_STATES } from '../connection/constants.js';

import { configureStore } from 'redux-starter-kit';
import { connectionsState, connectionsReducer, setCloudConnectionState } from "./connections";
import {store, watchChanges} from "../store.js"

import deepFreeze from 'deep-freeze'
// deepFreeze(state) to test state immutability

describe('connectionsReducer', () => {
  it('sinitial value is correct', () => {

    const stateNow = store.getState()
    const storedConnection = connectionsState.selectors.getConnections(stateNow)

    console.log("Connections", storedConnection)
    expect(storedConnection.cloudState).toBe(CLOUD_CONNECTION_STATES.UNCONNECTED);

  })
})
