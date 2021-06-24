/** @test {rooms} */
// import { configureStore } from '@reduxjs/toolkit';
// import deepFreeze from 'deep-freeze';
import { roomsState, roomsReducer } from './rooms';
import { store } from '../store';

// deepFreeze(state) to test state immutability

describe('Pure connectionsReducer', () => {
  it('should handle initial state', () => {
    expect(roomsReducer(undefined, {})).toEqual({});
  });
});

describe('Store roomsReducer', () => {
  it('initial value is correct', () => {
    const room = { id: 111, name: 'testiI' };
    const rooms = { hubId: '007', rooms: { 111: room } };
    store.dispatch(roomsState.actions.setRooms(rooms));
    const stateNow = store.getState();
    const storedRooms = roomsState.selectors.getRooms(stateNow);
    console.log('storedRooms', storedRooms);
    expect(storedRooms['007']['111']).toEqual(room);
  });
});
