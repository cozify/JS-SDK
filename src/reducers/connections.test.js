/** @test {connections} */
// import { configureStore } from '@reduxjs/toolkit';
// import deepFreeze from 'deep-freeze';
import { CLOUD_CONNECTION_STATES } from '../connection/constants';

import { connectionsState, connectionsReducer } from './connections';
import { store } from '../store';

// deepFreeze(state) to test state immutability

describe('Pure connectionsReducer', () => {
  it('should handle initial state', () => {
    expect(connectionsReducer(undefined, {})).toEqual({ cloudState: CLOUD_CONNECTION_STATES.UNCONNECTED });
  });
});


describe('Store connectionsReducer', () => {
  it('initial value is correct', () => {
    const stateNow = store.getState();
    const storedConnection = connectionsState.selectors.getConnections(stateNow);

    console.log('Connections', storedConnection);
    expect(storedConnection.cloudState).toBe(CLOUD_CONNECTION_STATES.UNCONNECTED);
  });
});
