// 
// import isEmpty from 'lodash/isEmpty';
// import isArray from 'lodash/isArray';
// import pick from 'lodash/pick';
import { store } from '../store';
// import { userState } from '../reducers/user';
import { plansState, reactFetchPlans } from '../reducers/plans';
import { planDocumentsState, reactFetchPlanDocuments } from '../reducers/planDocuments';
// import { send, COMMANDS } from '../connection/send';
// import uuid from 'uuid'

export function getPlans() {
  const stateNow = store.getState();
  return plansState.selectors.getPlans(stateNow);
}

export function setPlans(plans) {
  store.dispatch(plansState.actions.setPlansState(plans));
}

export async function fetchPlans() {
  return new Promise((resolve, reject) => {
    try {
      store.dispatch(reactFetchPlans());
      // const stateNow = store.getState();
      resolve(getPlans());
    } catch (e) {
      reject(e);
    }
  });
}


export async function insertPlan() {
  return new Promise((resolve, reject) => {
    reject(new Error('removePlan TBD'));
    /*  Was just test implementation of qql
    client.mutate({
      variables: {
        "object": {
          "name": "uusi",
          "documents": {
            "data": [
              {
                "nodes": {
                  "data": [
                    {
                      "data": {
                        "rooms": [
                          "$LIVINGROOM"
                        ],
                        "devices": [],
                        "rules": [],
                        "scenes": [],
                        "type": "HUB",
                        "name": "HUB 123"
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      },
      mutation: INSERT_PLAN
    })
    .then((result) => {
        debugger;
        console.log(result.data.insert_t_plan_one)
        // TODO Should list documents of plan
        resolve({});
      }).catch((error) => {
        debugger;
        console.error('SDK listPlans error:', error);
        reject(error);
      });
    */
  });
}
// const plansUrl = "http://localhost:3001/plans"
// const plansUrl = 'https://localhost:8449/cc/0.1/partner/plans';


export function getPlanDocuments(planId) {
  const stateNow = store.getState();
  // const array = planDocumentsState.selectors.selectAll(stateNow);
  // const entities = planDocumentsState.selectors.selectEntities(stateNow);
  // const id = planDocumentsState.selectors.selectById(stateNow, "d39e6ddc-6220-4c20-8c7d-9d01e65192de");
  // const idsAndEntities = planDocumentsState.selectors.getDocuments(stateNow);
  return planDocumentsState.selectors.selectByPlanId(stateNow, planId);
}

export async function fetchPlanDocuments(planId) {
  return new Promise((resolve, reject) => {
    try {
      store.dispatch(reactFetchPlanDocuments(planId));
      // const stateNow = store.getState();
      resolve(getPlanDocuments(planId));
    } catch (e) {
      reject(e);
    }
  });
}

export function setPlanDocuments(plans) {
  store.dispatch(planDocumentsState.actions.setPlanDocumentsState(plans));
}


export function addRoomName(newName) {
  store.dispatch(plansState.actions.addRoomName(newName));
}

export function removeRoomName(newName) {
  store.dispatch(plansState.actions.removeRoomName(newName));
}

export function addDeviceType(newName) {
  store.dispatch(plansState.actions.addDeviceType(newName));
}

export function removeDeviceType(newName) {
  store.dispatch(plansState.actions.removeDeviceType(newName));
}

export function addSceneType(newName) {
  store.dispatch(plansState.actions.addSceneType(newName));
}

export function removeSceneType(newName) {
  store.dispatch(plansState.actions.removeSceneType(newName));
}

export function addRuleType(newName) {
  store.dispatch(plansState.actions.addRuleType(newName));
}

export function removeRuleType(newName) {
  store.dispatch(plansState.actions.removeRuleType(newName));
}

export function addTemplate(newTemplate) {
  store.dispatch(plansState.actions.addTemplate(newTemplate));
}

export function setTemplate(template) {
  store.dispatch(plansState.actions.setTemplate(template));
}

export function removeTemplate(template) {
  store.dispatch(plansState.actions.removeTemplate(template));
}


export function addLocationNode(parentId, newNode) {
  store.dispatch(plansState.actions.addLocationNode({ parentId, newNode }));
}

export function setLocationNode(nodeToBeSet) {
  store.dispatch(plansState.actions.setLocationNode(nodeToBeSet));
}

export function removeLocationNode(nodeId) {
  store.dispatch(plansState.actions.removeLocationNode(nodeId));
}


export function simplifyPlans() {
  const nodes = getPlans();
  const nodesCopy = {};
  // nodesCopy.roomNames = { ...nodes.roomNames };
  // nodesCopy.templates = { ...nodes.templates };

  function simplifyNode(childNode) {
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
/*
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
} */
