// @flow
// import isEmpty from 'lodash/isEmpty';
// import isArray from 'lodash/isArray';
// import pick from 'lodash/pick';
import { store } from '../store';
import { userState } from '../reducers/user';
import { plansState } from '../reducers/plans';
import type { TEMPLATE_TYPE, NODE_TYPE, PLANS_TYPE } from './constants';
import { send, COMMANDS } from '../connection/send';

// const plansUrl = "http://localhost:3001/plans"
const plansUrl = 'https://localhost:8449/cc/0.1/partner/plans';

export function addRoomName(newName: string) {
  store.dispatch(plansState.actions.addRoomName(newName));
}

export function removeRoomName(newName: string) {
  store.dispatch(plansState.actions.removeRoomName(newName));
}

export function addDeviceType(newName: string) {
  store.dispatch(plansState.actions.addDeviceType(newName));
}

export function removeDeviceType(newName: string) {
  store.dispatch(plansState.actions.removeDeviceType(newName));
}

export function addSceneType(newName: string) {
  store.dispatch(plansState.actions.addSceneType(newName));
}

export function removeSceneType(newName: string) {
  store.dispatch(plansState.actions.removeSceneType(newName));
}

export function addRuleType(newName: string) {
  store.dispatch(plansState.actions.addRuleType(newName));
}

export function removeRuleType(newName: string) {
  store.dispatch(plansState.actions.removeRuleType(newName));
}

export function addTemplate(newTemplate: TEMPLATE_TYPE) {
  store.dispatch(plansState.actions.addTemplate(newTemplate));
}

export function setTemplate(template: TEMPLATE_TYPE) {
  store.dispatch(plansState.actions.setTemplate(template));
}

export function removeTemplate(template: TEMPLATE_TYPE) {
  store.dispatch(plansState.actions.removeTemplate(template));
}

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
 * List plans
 * @return {PLANS_TYPE}
 */
export async function listPlans(): Promise<PLANS_TYPE> {
  return new Promise((resolve, reject) => {
    const stateNow = store.getState();
    const user = userState.selectors.getUser(stateNow);
    if (!user || !user.authKey) {
      console.error('SDK listPlans error: No userKey!');
      reject(new Error('List plans error: No userKey!'));
      return;
    }
    const { authKey } = user;
    if (!authKey) {
      console.error('SDK listPlans error: No authKey!');
      reject(new Error('List plans error: No authKey!'));
      return;
    }

    send({
      command: COMMANDS.CMD_LIST_PLANS, authKey, url: plansUrl,
    })
      .then((plans) => {
        console.debug('SDK listPlans ok', plans);
        setPlans(plans);
        resolve(getPlans());
      })
      .catch((error) => {
        console.error('SDK listPlans error:', error);
        reject(error);
      });
  });
}


/**
 * Load plan
 * @return {PLANS_TYPE}

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
      command: COMMANDS.CMD_GET_PLAN, authKey, url: plansUrl,
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
*/

export function simplifyPlans(): Object {
  const nodes = getPlans();
  const nodesCopy = {};
  // nodesCopy.roomNames = { ...nodes.roomNames };
  // nodesCopy.templates = { ...nodes.templates };

  function simplifyNode(childNode: Object): Object {
    console.log('simply id', childNode.id);
    console.log('simply data', childNode.data);
    const nodesTree = [];
    for (let i = 0; i < childNode.childIds.length; i += 1) {
      const { childIds } = childNode;
      const hasChildren = childIds !== undefined && childIds.length > 0;
      if (nodes.locations[childNode.childIds[i]] && nodes.locations[childNode.childIds[i]].data) {
        nodesTree[i] = { ...nodes.locations[childNode.childIds[i]].data };
        nodesTree[i].id = childNode.childIds[i];
        nodesTree[i].child = hasChildren ? simplifyNode(nodes.locations[childNode.childIds[i]]) : undefined;
      }
      /*
      if (nodesCopy2[i].data.type === 'HUB'){}
      nodesCopy2[i] = {
        id: childNode.childIds[i],
        data: childNode.data || null,
        childs: hasChildren ? simplifyNode(nodes.locations[childNode.childIds[i]]) : undefined,
      };
      */
    }
    console.log(`simply ${childNode.id} return`, nodesTree);
    return nodesTree;
  }
  nodesCopy.locations = simplifyNode(nodes.locations.root);
  return nodesCopy;
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
      sceneTypes: plansToBeSaved.sceneTypes,
      deviceTypes: plansToBeSaved.deviceTypes,
      ruleTypes: plansToBeSaved.ruleTypes,
      roomNames: plansToBeSaved.roomNames,
      templates: plansToBeSaved.templates,
      locations: plansToBeSaved.locations,
    };

    send({
      command: COMMANDS.CMD_SAVE_PLAN, authKey, data, url: plansUrl,
    })
      .then((status) => {
        console.debug('SDK savePlans ok', status);
        // store.dispatch(setPlans(plans));
        resolve(status);
      })
      .catch((error) => {
        // eslint-disable-next-line
        debugger;
        console.error('SDK savePlans error:', error);
        reject(error);
      });
  });
}
