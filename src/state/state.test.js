import { CONNECTION_STATES, state } from './state.js';
/** @test {state} */
describe('state', () => {
  it('is truthy', () => {
    expect(state.connectionState).toBe(CONNECTION_STATES.UNCONNECTED);
  });
});
