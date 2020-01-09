
// @flow

// This actionreducer uses internally https://github.com/mweststrate/immer, so it's safe to modify given state directly
import { createSlice } from 'redux-starter-kit';
import isArray from 'lodash/isArray';

/*
* Helpers
*/

const setId = (idObj: Object) => {
  const givenObject = idObj;
  if (!givenObject.id) {
    givenObject.id = Date.now();
  }
  return givenObject;
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
      },
    },
  },
  reducers: {

    setPlansState(state, action) {
      const stateToSet = state;
      const newState = action.payload;
      const oldState = stateToSet.plansState;
      console.log(`PLANS state ${oldState} -> ${newState}`);
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

      Object.entries(templates).forEach((entry) => {
        setId(entry);
        const [id, template] = entry;
        newTemplates[id] = { ...template };
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
      const template = action.payload;
      setId(template);
      if (template.id) {
        stateToSet.templates[template.id] = { ...template };
      }
    },


    /*
     * Reducer action of setting template state
     * @param {Object} state
     * @param {Object} action
     */
    setTemplate(state, action) {
      const stateToSet = state;
      const template = action.payload;
      setId(template);
      if (template.id && stateToSet.templates[template.id]) {
        stateToSet.templates[template.id] = { ...template };
      }
    },

    /*
     * Reducer action of removing plan state
     * @param {Object} state
     * @param {Object} action
     */
    removeTemplate(state, action) {
      const stateToSet = state;
      const template = action.payload;
      setId(template);
      if (template.id && stateToSet.templates[template.id]) {
        delete stateToSet.templates[template.id];
      }
    },

    /*
     * Reducer action of setting installations state
     * @param {Object} state
     * @param {Object} action
     */
    setInstallations(state, action) {
      const stateToSet = state;

      const { installations } = action.payload;
      const newInstallations = {};

      Object.entries(installations).forEach((entry) => {
        setId(entry);
        const [id, installation] = entry;
        newInstallations[id] = { ...installation };
      });
      stateToSet.installations = { ...newInstallations };
    },

    /*
     * Reducer action of adding installation state
     * @param {Object} state
     * @param {Object} action
     */
    addInstallation(state, action) {
      const stateToSet = state;
      const installation = action.payload;
      setId(installation);
      if (installation.id) {
        stateToSet.installations[installation.id] = { ...installation };
      }
    },

    /*
     * Reducer action of setting plan state
     * @param {Object} state
     * @param {Object} action
     */
    setInstallation(state, action) {
      const stateToSet = state;
      const installation = action.payload;
      setId(installation);
      if (stateToSet.installations[installation.id]) {
        stateToSet.installations[installation.id] = { ...installation };
      }
    },

    /*
     * Reducer action of removing plan state
     * @param {Object} state
     * @param {Object} action
     */
    removeInstallation(state, action) {
      const stateToSet = state;
      const installation = action.payload;
      setId(installation);
      if (installation.id && stateToSet.installations[installation.id]) {
        delete stateToSet.installations[installation.id];
      }
    },

    /*
     * Reducer action of adding country state
     * @param {Object} state
     * @param {Object} action
     */
    addLocationCountry(state, action) {
      const stateToSet = state;
      const country = action.payload;
      setId(country);
      if (country.id) {
        stateToSet.locations[country.id] = { ...country };
      }
    },

    /*
     * Reducer action of setting country state
     * @param {Object} state
     * @param {Object} action
     */
    setLocationCountry(state, action) {
      const stateToSet = state;
      const country = action.payload;
      setId(country);
      if (stateToSet.locations[country.id]) {
        stateToSet.locations[country.id] = { ...country };
      }
    },

    /*
     * Reducer action of removing country state
     * @param {Object} state
     * @param {Object} action
     */
    removeLocationCountry(state, action) {
      const stateToSet = state;
      const country = action.payload;
      setId(country);
      if (country.id && stateToSet.locations[country.id]) {
        delete stateToSet.locations[country.id];
      }
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
      const { parentId, newNode } = action.payload;
      const parentTempId = parentId || 'root';
      if (newNode.id) {
        newNode.id = parentTempId.concat(':').concat(newNode.id);
      } else if (newNode.data && newNode.data.name) {
        newNode.id = parentTempId.concat(':').concat(newNode.data.name.replace(/\s+/g, '').replace(/\./g, '').replace(/:/g, ''));
      } else {
        newNode.id = parentTempId.concat(':?');
      }

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
      if (node && node.id && stateToSet.locations[node.id]) {
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
      console.info('removeLocationNode ', nodeId);
      if (nodeId && nodeId !== 'root') {
        const descendantIds = getAllDescendantIds(stateToSet.locations, nodeId);
        console.info('descendantIds', descendantIds);
        const parent = findChild(stateToSet.locations, nodeId);
        console.info('PARENT', JSON.stringify(parent));
        if (parent && parent.id) {
          stateToSet.locations = deleteMany(stateToSet.locations, [nodeId, ...descendantIds]);
          console.info('child not yet removed', JSON.stringify(stateToSet.locations[parent.id].childIds));
          stateToSet.locations[parent.id].childIds = stateToSet.locations[parent.id].childIds.filter((id) => id !== nodeId);
          console.info('child removed', JSON.stringify(stateToSet.locations[parent.id].childIds));
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
