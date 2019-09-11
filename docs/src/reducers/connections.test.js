/** @test {connections} */
// import { configureStore } from 'redux-starter-kit';
// import deepFreeze from 'deep-freeze';
import { CLOUD_CONNECTION_STATES } from '../connection/constants';

import { connectionsState } from './connections';
import { store } from '../store';

// deepFreeze(state) to test state immutability

describe('connectionsReducer', () => {
  it('sinitial value is correct', () => {
    const stateNow = store.getState();
    const storedConnection = connectionsState.selectors.getConnections(stateNow);

    console.log('Connections', storedConnection);
    expect(storedConnection.cloudState).toBe(CLOUD_CONNECTION_STATES.UNCONNECTED);
  });
});
