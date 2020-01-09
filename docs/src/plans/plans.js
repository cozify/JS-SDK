// 
// import isEmpty from 'lodash/isEmpty';
// import isArray from 'lodash/isArray';
// import pick from 'lodash/pick';
import { store } from '../store';
import { userState } from '../reducers/user';
import { plansState } from '../reducers/plans';
import { send, COMMANDS } from '../connection/send';

/**
 * Set plans
 * @return {PLANS_TYPE}
 */
export function setPlans(plans) {
  store.dispatch(plansState.actions.setPlansState(plans));
}

/**
 * Get plans
 * @return {PLANS_TYPE}
 */
export function getPlans() {
  const stateNow = store.getState();
  return plansState.selectors.getPlans(stateNow);
}


export async function loadPlans() {
  return new Promise((resolve, reject) => {
    const stateNow = store.getState();
    const user = userState.selectors.getUser(stateNow);
    if (!user || !user.authKey) {
      console.error('SDK loadPlans error: No userKey!');
      reject(new Error('Load plans error: No userKey!'));
      return;
    }
    const { authKey } = user;
    if (!authKey) {
      console.error('SDK loadPlans error: No authKey!');
      reject(new Error('Load plans error: No authKey!'));
      return;
    }

    send({
      command: COMMANDS.CMD_GET_PLANS, authKey, url: 'http://localhost:3001/plans',
    })
      .then((plans) => {
        console.debug('SDK loadPlans ok', plans);
        setPlans(plans);
        resolve(getPlans());
      })
      .catch((error) => {
        console.error('SDK loadPlans error:', error);
        reject(error);
      });
  });
}

export async function savePlans() {
  return new Promise((resolve, reject) => {
    const stateNow = store.getState();
    const user = userState.selectors.getUser(stateNow);
    if (!user || !user.authKey) {
      console.error('SDK savePlans error: No userKey!');
      reject(new Error('Save plans error: No userKey!'));
      return;
    }
    const { authKey } = user;
    if (!authKey) {
      console.error('SDK savePlans error: No authKey!');
      reject(new Error('Save plans error: No authKey!'));
      return;
    }
    const data = getPlans();

    send({
      command: COMMANDS.CMD_SAVE_PLANS, authKey, data, method: 'POST', url: 'http://localhost:3001/plans',
    })
      .then((plans) => {
        console.debug('SDK savePlans ok', plans);
        store.dispatch(setPlans(plans));
        resolve(plans);
      })
      .catch((error) => {
        console.error('SDK savePlans error:', error);
        reject(error);
      });
  });
}
