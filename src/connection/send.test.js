import {
  COMMANDS, send,
} from './send.js';

/** @test {send} */
describe('COMMANDS', () => {
  it('COMMAND.LOGIN is as expected', () => {
    expect(COMMANDS.USER_LOGIN.url).toBe('https://testapi.cozify.fi/ui/0.2/user/login');
  });
});
