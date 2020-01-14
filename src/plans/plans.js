// @flow
// import isEmpty from 'lodash/isEmpty';
// import isArray from 'lodash/isArray';
// import pick from 'lodash/pick';
import { store } from '../store';
import { userState } from '../reducers/user';
import { plansState } from '../reducers/plans';
import type { NODE_TYPE, PLANS_TYPE } from './constants';
import { send, COMMANDS } from '../connection/send';

/**
 * Set plans
 * @return {PLANS_TYPE}
 */
export function setPlans(plans: PLANS_TYPE) {
  store.dispatch(plansState.actions.setPlansState(plans));
}

/**
 * Get plans
 * @return {PLANS_TYPE}
 */
export function getPlans(): PLANS_TYPE {
  const stateNow = store.getState();
  return plansState.selectors.getPlans(stateNow);
}

export function addLocationNode(parentId: string, newNode: NODE_TYPE) {
  store.dispatch(plansState.actions.addLocationNode({ parentId, newNode }));
}

export function setLocationNode(nodeToBeSet: NODE_TYPE) {
  store.dispatch(plansState.actions.setLocationNode(nodeToBeSet));
}

export function removeLocationNode(nodeId: string) {
  store.dispatch(plansState.actions.removeLocationNode(nodeId));
}

/**
 * Load plans
 * @return {PLANS_TYPE}
 */
export async function loadPlans(): Promise<PLANS_TYPE> {
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

/**
 * Save plans
 * @return {PLANS_TYPE}
 */
export async function savePlans(): Promise<PLANS_TYPE> {
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

    const plansToBeSaved = getPlans();
    const data = {
      templates: plansToBeSaved.templates,
      installations: plansToBeSaved.installations,
      locations: plansToBeSaved.locations,
    };

    send({
      command: COMMANDS.CMD_SAVE_PLANS, authKey, data, url: 'http://localhost:3001/plans',
    })
      .then((status) => {
        console.debug('SDK savePlans ok', status);
        // store.dispatch(setPlans(plans));
        resolve(status);
      })
      .catch((error) => {
        debugger;
        console.error('SDK savePlans error:', error);
        reject(error);
      });
  });
}
