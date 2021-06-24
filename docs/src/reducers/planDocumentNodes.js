// 
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';


/* import {
  GET_PLAN_DOCUMENT_NODES,
  SUBS_PLAN_DOCUMENT_NODES,
  INSERT_PLAN_DOCUMENT_NODE,
  UPDATE_PLAN_DOCUMENT_NODE,
  REMOVE_PLAN_DOCUMENT_NODE,
  qqlClient,
  normalize,
  isAuth
} from '../qql.js'
*/

const planDocumentNodesAdapter = createEntityAdapter({
  // Assume IDs are stored in a field uid
  selectId: (node) => node.uid,
  // Keep the "all IDs" array sorted based on document
  sortComparer: (a, b) => a.document_id.localeCompare(b.document_id),
});

// Fetch
async function fetchPlanDocumentNodes(documentId) {
  return new Promise((resolve, reject) => {
    reject(new Error(`fetchPlanDocuments documentId: ${documentId} TBD`));
    /*  Was just test implementation of qql
    qqlClient.query({
      variables: {
        "document_id": documentId
      },
      query: GET_PLAN_DOCUMENT_NODES
    })
    .then((result) => {
      const queryResults = normalize(result);
      console.debug('SDK fetchPlanDocumentNodes ok', queryResults);
      resolve(queryResults.nodes);
    }).catch((error) => {
      debugger;
      console.error('SDK fetchPlanDocumentNodes error:', error);
      reject(error);
    });
    */
  });
}

export const reactFetchPlanDocumentNodes = createAsyncThunk(
  'plans/fetchPlanDocumentNodes',
  async (documentId, ThunkAPI) => {
    // if (isAuth(ThunkAPI.getState())) {
    console.debug('fetchPlanDocuments state: ', ThunkAPI.getState());
    return fetchPlanDocumentNodes(documentId);
  },

);

// Subscribe
export const reactSubscribePlanDocumentNodes = createAsyncThunk(
  'plans/subscribePlanDocumentNodes',
  async (params, ThunkAPI) => new Promise((resolve, reject) => {
    console.debug('reactSubscribePlanDocumentNodes state: ', ThunkAPI.getState());
    reject(new Error('reactSubscribePlanDocumentNodes TBD'));
    /*  Was just test implementation of qql
      if (isAuth(ThunkAPI.getState())) {
        const {documentId} = params;
        const subsHandle = qqlClient.subscribe({
          query: SUBS_PLAN_DOCUMENT_NODES,
          variables: {"document_id": documentId },
        }).subscribe({
          next(data) {
            try {
              if (data && data.data && data.data.t_plan_document_node && data.data.t_plan_document_node.length > 0) {
                const results = normalize(data);
                ThunkAPI.dispatch(planDocumentNodesState.actions.setPlanDocumentNodesState(results.nodes));
              } else {
                ThunkAPI.dispatch(planDocumentNodesState.actions.setPlanDocumentNodesState({nodes:{}}));
              }
              resolve()
            } catch(e) {
              reject(e)
              debugger
              console.error('reactSubscribePlanDocumentNodes exception', e);
            }
          },
          error(err) {
            reject(err)
            debugger
            console.error('reactSubscribePlanDocumentNodes err', err);
          }
        })
      } else {
        reject()
      }
    }
    */
  }),
);


/*
alinode
{
  "object": {
    "document_id": "d39e6ddc-6220-4c20-8c7d-9d01e65192de",
    "parent_id": "0d62e0bc-1c29-4cb9-bc79-a39a9b59768f",
    "data": {
      "type": "TEST0.1"
    }
  }
}

päätason
{
  "object": {
    "document_id": "d39e6ddc-6220-4c20-8c7d-9d01e65192de",
    "parent_id": null,
    "data": {
      "type": "TEST2"
    }
  }
}
 */
// Insert
async function insertPlanDocumentNode(documentId, parentId, changes) {
  const changesToBeMade = changes;
  if (changes && changes.type) {
    // eslint-disable-next-line
    changesToBeMade.__typename = changes.type;
  }
  return new Promise((resolve, reject) => {
    reject(new Error(`insertPlanDocumentNode docId: ${documentId}, parentId: ${parentId} TBD, changes: ${changesToBeMade}`));
    /*  Was just test implementation of qql
    qqlClient.mutate({
      variables: {
        object: {
          document_id: documentId,
          parent_id: parentId,
          data: changesToBeMade
        }
      },
      mutation: INSERT_PLAN_DOCUMENT_NODE
    })
    .then((result) => {
      const queryResults = normalize(result);
      console.debug('SDK insertPlanDocumentNode ok', queryResults);
      resolve(queryResults.nodes);
    }).catch((error) => {
      debugger;
      console.error('SDK insertPlanDocumentNode error:', error);
      reject(error);
    });
    */
  });
}

export const reactInsertPlanDocumentNode = createAsyncThunk(
  'plans/insertPlanDocumentNode',
  async (params, ThunkAPI) => {
    // if (isAuth(ThunkAPI.getState())) {
    console.debug('reactInsertPlanDocumentNode state:', ThunkAPI.getState());
    const { documentId, parentId, changes } = params;
    return insertPlanDocumentNode(documentId, parentId, changes);
    // }
  },
);

/* {
  "uid": "e1727bae-cd29-4a77-8234-a6528fda48fc",
  "changes": {
    "data": {
      "name": "HUB 2.0"
    }
  }
} */
// Update
async function updatePlanDocumentNode(uid, changes) {
  return new Promise((resolve, reject) => {
    reject(new Error(`updatePlanDocumentNode uid: ${uid} TBD, changes: ${changes}`));
    /*  Was just test implementation of qql
    qqlClient.mutate({
      variables: {
        uid: uid,
        changes: changes
      },
      mutation: UPDATE_PLAN_DOCUMENT_NODE
    })
    .then((result) => {
      debugger
      const queryResults = normalize(result);
      console.debug('SDK updatePlanDocumentNode ok', queryResults);
      resolve(queryResults.nodes);
    }).catch((error) => {
      debugger;
      console.error('SDK updatePlanDocumentNode error:', error);
      reject(error);
    });
    */
  });
}


export const reactUpdatePlanDocumentNode = createAsyncThunk(
  'plans/updatePlanDocumentNode',
  async (params, ThunkAPI) => {
    // if (isAuth(ThunkAPI.getState())) {
    console.debug('reactUpdatePlanDocumentNode state: ', ThunkAPI.getState());
    const { uid, changes } = params;
    return updatePlanDocumentNode(uid, changes);
    // }
  },
);

// Remove Plan
async function removePlanDocumentNode(uid) {
  return new Promise((resolve, reject) => {
    reject(new Error(`removePlanDocumentNode uid: ${uid} TBD`));
    /*  Was just test implementation of qql
    qqlClient.mutate({
      variables: {
        "uid": uid,
      },
      mutation: REMOVE_PLAN_DOCUMENT_NODE
    })
    .then((result) => {
      debugger
      console.debug('SDK removePlanDocumentNode ok', result);
      resolve(result);
    }).catch((error) => {
      debugger;
      console.error('SDK removePlanDocumentNode error:', error);
      reject(error);
    });
    */
  });
}


export const reactRemovePlanDocumentNode = createAsyncThunk(
  'plans/removePlanDocumentNode',
  async (params, ThunkAPI) => {
    // if (isAuth(ThunkAPI.getState())) {
    console.debug('reactRemovePlanDocumentNode state: ', ThunkAPI.getState());
    const { uid } = params;
    return removePlanDocumentNode(uid);
    // }
  },
);

export const planDocumentNodesState = createSlice({
  name: 'nodes',
  initialState: planDocumentNodesAdapter.getInitialState(),
  reducers: {
    setPlanDocumentNodesState(state, action) {
      const stateToSet = state;
      const newState = action.payload;
      planDocumentNodesAdapter.setAll(stateToSet, newState);
    },
  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [reactFetchPlanDocumentNodes.fulfilled]: (state, action) => {
      planDocumentNodesAdapter.upsertMany(state, action.payload);
    },
    [reactFetchPlanDocumentNodes.rejected]: (state, action) => {
      console.error('SDK reactFetchPlanDocumentNodes rejected state: ', state);
      console.error('SDK reactFetchPlanDocumentNodes rejected action: ', action);
    },
    [reactInsertPlanDocumentNode.fulfilled]: (state, action) => {
      planDocumentNodesAdapter.updateOne(state, action.payload);
    },
    [reactInsertPlanDocumentNode.rejected]: (state, action) => {
      console.error('SDK reactInsertPlanDocumentNode rejected state: ', state);
      console.error('SDK reactInsertPlanDocumentNode rejected action: ', action);
    },
    [reactUpdatePlanDocumentNode.fulfilled]: (state, action) => {
      planDocumentNodesAdapter.updateOne(state, action.payload);
    },
    [reactUpdatePlanDocumentNode.rejected]: (state, action) => {
      console.error('SDK reactUpdatePlanDocumentNode rejected state: ', state);
      console.error('SDK reactUpdatePlanDocumentNode rejected action: ', action);
    },
    [reactRemovePlanDocumentNode.fulfilled]: (state, action) => {
      planDocumentNodesAdapter.updateOne(state, action.payload);
    },
    [reactRemovePlanDocumentNode.rejected]: (state, action) => {
      console.error('SDK reactRemovePlanDocumentNode rejected state: ', state);
      console.error('SDK reactRemovePlanDocumentNode rejected action: ', action);
    },
  },
});


planDocumentNodesState.selectors = planDocumentNodesAdapter.getSelectors((state) => state.nodes);
planDocumentNodesState.selectors.selectPlanDocumentNodes = createSelector(
  [(state) => state.nodes, (state, documentId) => documentId],
  (nodes, documentId) => {
    const ids = nodes.ids.filter((id) => nodes.entities[id].document_id === documentId);
    const entities = [];
    ids.forEach((id) => {
      entities.push(nodes.entities[id]);
    });
    return entities;
  },
);

export const {
  selectById: reactSelectDocumentNodeById,
  selectIds: reactSelectDocumentNodeIds,
  selectEntities: reactSelectDocumentNodeEntities,
  selectAll: reactSelectAllDocumentNodes,
  selectTotal: reactSelectTotalDocumentNodes,
} = planDocumentNodesAdapter.getSelectors((state) => state.nodes);
export const reactSelectPlanDocumentNodes = planDocumentNodesState.selectors.selectPlanDocumentNodes;


// const { actions, reducer } = planDocumentNodesState;
const { reducer } = planDocumentNodesState;

/**
 * Plan Documents reducer
 * @type {function} reducer
 */
export { reducer as planDocumentNodesReducer };
