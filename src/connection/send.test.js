import { COMMANDS } from './constants';

// import { send } from './send';

/** @test {send} */
describe('COMMANDS', () => {
  it('COMMAND.LOGIN is as expected', () => {
    expect(COMMANDS.USER_LOGIN.url).toBe('user/login');
  });
});
