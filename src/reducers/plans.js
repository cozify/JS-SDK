
// @flow

// This actionreducer uses internally https://github.com/mweststrate/immer, so it's safe to modify given state directly
import { createSlice } from 'redux-starter-kit';
import isArray from 'lodash/isArray';
import { PLAN_NODES } from '../plans/constants';

/*
* Helpers
*/

/*
const setId = (idObj: Object) => {
  const givenObject = idObj;
  if (!givenObject.id) {
    givenObject.id = Date.now();
  }
  return givenObject;
};
*/

const setId = (parentTempId: string, newItem: Object) => {
  const item = { ...newItem };
  if (item.id) {
    item.id = parentTempId.concat(':').concat(item.id);
  } else if (item.data && item.data.name) {
    item.id = parentTempId.concat(':').concat(item.data.name.replace(/\s+/g, '').replace(/\./g, '').replace(/:/g, ''));
  } else {
    item.id = parentTempId.concat(':?');
  }
  return item;
};

const getAllDescendantIds = (state, nodeId) => (
  state[nodeId].childIds.reduce((acc, childId) => (
    [...acc, childId, ...getAllDescendantIds(state, childId)]
  ), [])
);

const deleteMany = (givenState, ids) => {
  const state = { ...givenState };
  ids.forEach((id) => delete state[id]);
  return state;
};


type NODE_TYPE = {
  id?: ?string,
  childIds: Array<string>,
  data: Object,
  open: boolean
}
type NODE_MAP_TYPE = {[id: string]: NODE_TYPE}

const findChild = (state: NODE_MAP_TYPE, id) => {
  let found;
  (Object.values(state): any).forEach((node: NODE_TYPE) => {
    if (!found) {
      if (node && node.childIds) {
        // console.error(`FIND ${id} in ${JSON.stringify(node.childIds)} when node ${JSON.stringify(node)}`);
        if (isArray(node.childIds)) {
          if (node.childIds.includes(id)) {
            found = node;
          }
        }
      }
    }
  });
  // console.error(`FOUND ${id} => ${JSON.stringify(found)}`);
  return found;
};

/**
 * Plans action creators object
 * @see  https://github.com/reduxjs/redux-starter-kit/blob/master/docs/api/createSlice.md
 * @return { {
 *   slice : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */
export const plansState = createSlice({
  slice: 'plans',
  initialState: {
    templates: {},
    installations: {},
    locations: {
      root: {
        id: 'root',
        childIds: [],
        data: {
          name: 'root',
        },
        open: false,
      },
    },
  },
  reducers: {

    setPlansState(state, action) {
      const stateToSet = state;
      const newState = action.payload;
      const oldState = stateToSet.plansState;
      console.log(`SDK setPlansState: PLANS state ${oldState} -> ${newState}`);
      stateToSet.templates = { ...newState.templates };
      stateToSet.installations = { ...newState.installations };
      stateToSet.locations = { ...newState.locations };
    },

    /*
     * Reducer action of setting all templates state
     * @param {Object} state
     * @param {Object} action
    */
    setTemplates(state, action) {
      const stateToSet = state;

      const { templates } = action.payload;
      const newTemplates = {};

      Object.values(templates).forEach((entry) => {
        const newTemplate = setId(PLAN_NODES.TEMPLATE, entry);
        // console.log(JSON.stringify(newTemplate));
        newTemplates[newTemplate.id] = { ...newTemplate };
      });
      stateToSet.templates = { ...newTemplates };
    },


    /*
     * Reducer action of adding template state
     * @param {Object} state
     * @param {Object} action
     */
    addTemplate(state, action) {
      const stateToSet = state;
      const parentTempId = PLAN_NODES.TEMPLATE;
      const newTemplate = setId(parentTempId, action.payload);

      // Check that node doesn't already exist
      if (!newTemplate || !newTemplate.id) {
        throw new Error('SDK addTemplate - no new template given');
      }
      if (stateToSet.templates[newTemplate.id]) {
        throw new Error(`SDK addTemplate - template ${newTemplate.id} already exist`);
      }
      stateToSet.templates[newTemplate.id] = { ...newTemplate };
    },


    /*
     * Reducer action of setting template state
     * @param {Object} state
     * @param {Object} action
     */
    setTemplate(state, action) {
      const stateToSet = state;
      const template = action.payload;
      if (!template || !template.id) {
        throw new Error('SDK setTemplate - no template given');
      }
      if (!stateToSet.templates[template.id]) {
        throw new Error(`SDK setTemplate - template ${template.id} does not exist`);
      }
      const parentTempId = PLAN_NODES.TEMPLATE;
      if (template.data && template.data.name) {
        const oldId = template.id;
        const templateToBeSet = { ...template };
        templateToBeSet.id = null;
        const setNode = setId(parentTempId, templateToBeSet);
        if (setNode && oldId !== setNode.id && stateToSet.templates[oldId]) {
          delete stateToSet.templates[oldId];
          stateToSet.templates[setNode.id] = { ...setNode };
        } else if (setNode && setNode.id && stateToSet.templates[setNode.id]) {
          stateToSet.templates[setNode.id] = { ...setNode };
        } else {
          throw new Error(`SDK setLocationNode - template ${template.id} could not be set`);
        }
      } else if (template.id && stateToSet.templates[template.id]) {
        stateToSet.templates[template.id] = { ...template };
      } else {
        throw new Error(`SDK setLocationNode - template ${template.id} could not be set`);
      }
    },

    /*
     * Reducer action of removing plan state
     * @param {Object} state
     * @param {Object} action
     */
    removeTemplate(state, action) {
      const stateToSet = state;

      const templateId = action.payload;
      if (!templateId) {
        throw new Error('SDK removeLocationNode - no templateId given');
      }
      if (!stateToSet.templates[templateId]) {
        throw new Error(`SDK removeLocationNode - template ${templateId} doesnt exist`);
      }
      delete stateToSet.templates[templateId];
    },

    /*
     * Reducer action of adding location node state
     *
     * addLocationNode({parentId: parent, data:{}})
     *
     * addLocationNode({ parentId: null, newNode: country }));
     *
     */
    addLocationNode(state, action) {
      const stateToSet = state;
      const { parentId } = action.payload;
      const parentTempId = parentId || 'root';
      const newNode = setId(parentTempId, action.payload.newNode);

      // Check that node doesn't already exist
      if (!newNode || !newNode.id) {
        throw new Error('SDK addLocationNode - no new node given');
      }
      if (stateToSet.locations[newNode.id]) {
        throw new Error(`SDK addLocationNode - node ${newNode.id} already exist`);
      }

      if (!newNode.childIds) {
        newNode.childIds = [];
      }

      if (stateToSet.locations[parentTempId] && newNode && newNode.id) {
        if (!stateToSet.locations[parentTempId].childIds) {
          stateToSet.locations[parentTempId].childIds = [];
        }
        stateToSet.locations[parentTempId].childIds = [...stateToSet.locations[parentTempId].childIds, newNode.id];
        stateToSet.locations[newNode.id] = { ...newNode };
      }
    },

    /*
     * setLocationNode(node)
     */
    setLocationNode(state, action) {
      const stateToSet = state;
      const node = action.payload;

      if (!node || !node.id) {
        throw new Error('SDK setLocationNode - no node given');
      }
      if (!stateToSet.locations[node.id]) {
        throw new Error(`SDK setLocationNode - node ${node.id} does not exist`);
      }

      if (!node.childIds) {
        node.childIds = [];
      }

      const parentTempId = node.id.substr(0, node.id.lastIndexOf(':'));
      if (node.data && node.data.name) {
        const oldId = node.id;
        const nodeToBeSet = { ...node };
        nodeToBeSet.id = null;
        const setNode = setId(parentTempId, nodeToBeSet);
        if (setNode && oldId !== setNode.id && stateToSet.locations[oldId]) {
          stateToSet.locations[parentTempId].childIds = stateToSet.locations[parentTempId].childIds.filter((id) => id !== oldId);
          stateToSet.locations[parentTempId].childIds.push(setNode.id);
          delete stateToSet.locations[oldId];
          stateToSet.locations[setNode.id] = { ...setNode };
        } else if (setNode && setNode.id && stateToSet.locations[setNode.id]) {
          stateToSet.locations[setNode.id] = { ...setNode };
        } else {
          throw new Error(`SDK setLocationNode - node ${node.id} could not be set`);
        }
      } else {
        stateToSet.locations[node.id] = { ...node };
      }
    },


    /*
     * removeLocationNode
     */
    removeLocationNode(state, action) {
      const stateToSet = state;
      const nodeId = action.payload;
      if (!nodeId) {
        throw new Error('SDK removeLocationNode - no nodeId given');
      }
      if (!stateToSet.locations[nodeId]) {
        throw new Error(`SDK removeLocationNode - node ${nodeId} doesnt exist`);
      }
      // console.info('removeLocationNode ', nodeId);
      if (nodeId && nodeId !== 'root') {
        const descendantIds = getAllDescendantIds(stateToSet.locations, nodeId);
        // console.info('descendantIds', descendantIds);
        const parent = findChild(stateToSet.locations, nodeId);
        // console.info('PARENT', JSON.stringify(parent));
        if (parent && parent.id) {
          stateToSet.locations = deleteMany(stateToSet.locations, [nodeId, ...descendantIds]);
          // console.info('child not yet removed', JSON.stringify(stateToSet.locations[parent.id].childIds));
          stateToSet.locations[parent.id].childIds = stateToSet.locations[parent.id].childIds.filter((id) => id !== nodeId);
          // console.info('child removed', JSON.stringify(stateToSet.locations[parent.id].childIds));
        } else {
          throw new Error(`SDK removeLocationNode - node ${nodeId} parent does not exist`);
        }
      }
    },
  },
});


const { actions, reducer } = plansState;

/**
 * Devices reducer
 * @type {function} reducer
 */
export { reducer as plansReducer };

// Extract and export each action creator by name
/*
console.log(addDevice({ id: 123, name: 'Unnamed device' }))
{type : "devices/addDevice", payload : {id : 123, name: 'Unnamed device' }}
*/
export const {
  setTemplates, addTemplate, setTemplate, removeTemplate,
  setInstallations, addInstallation, setInstallation, removeInstallation,
  addLocationCountry, setLocationCountry, removeLocationCountry,
  addLocationNode, setLocationNode, removeLocationNode,
} = actions;
