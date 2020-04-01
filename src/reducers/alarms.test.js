/** @test {alarms} */
// import { configureStore } from '@reduxjs/toolkit';
// import deepFreeze from 'deep-freeze';
import { alarmsState, alarmsReducer } from './alarms';
import { store } from '../store';

// deepFreeze(state) to test state immutability

describe('Pure connectionsReducer', () => {
  it('should handle initial state', () => {
    expect(alarmsReducer(undefined, {})).toEqual({});
  });
});

describe('Store alarmsReducer', () => {
  it('initial value is correct', () => {
    const alarm = { id: 111, name: 'testiI' };
    const alarms = { hubId: '007', alarms: { 111: alarm } };
    store.dispatch(alarmsState.actions.setAlarms(alarms));
    const stateNow = store.getState();
    const storedArlarms = alarmsState.selectors.getAlarms(stateNow);
    console.log('storedArlarms', storedArlarms);
    expect(storedArlarms['007']['111']).toEqual(alarm);
  });
});
