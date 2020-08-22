// @flow
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  createSelector
} from "@reduxjs/toolkit";

import type { DOCUMENT_TYPE } from './constants';

import { GET_PLAN_DOCUMENTS, SUBS_PLAN_DOCUMENTS, INSERT_PLAN_DOCUMENT, UPDATE_PLAN_DOCUMENT, REMOVE_PLAN_DOCUMENT, qqlClient, normalize, isAuth } from '../qql.js'


const planDocumentsAdapter = createEntityAdapter({
  // Assume IDs are stored in a field uid
  selectId: (document) => {
    return document.uid;
  },
  // Keep the "all IDs" array sorted based on plans
  sortComparer: (a, b) => a.plan_id.localeCompare(b.plan_id)
})

// Fetch
async function fetchPlanDocuments(planId): Promise<DOCUMENT_TYPE> {
  return new Promise((resolve, reject) => {
    qqlClient.query({
      variables: {
        "plan_id": planId
      },
      query: GET_PLAN_DOCUMENTS
    })
    .then((result) => {
      const queryResults = normalize(result);
      console.debug('SDK fetchPlanDocuments ok', queryResults);
      resolve(queryResults.documents);
    }).catch((error) => {
      debugger;
      console.error('SDK fetchPlanDocuments error:', error);
      reject(error);
    });
  });
}

export const reactFetchPlanDocuments = createAsyncThunk(
  'plans/fetchPlanDocuments',
  async (planId, ThunkAPI) => {
    if (isAuth(ThunkAPI.getState())) {
      return await fetchPlanDocuments(planId)
    }
  }
)

// Subscribe
export const reactSubscribePlanDocuments  = createAsyncThunk(
  'plans/subscribePlanDocuments',
  async (params, ThunkAPI) => {
    return new Promise((resolve, reject) => {
      if (isAuth(ThunkAPI.getState())) {
        const {planId} = params;
        const subsHandle = qqlClient.subscribe({
          query: SUBS_PLAN_DOCUMENTS,
          variables: {"plan_id": planId },
        }).subscribe({
          next(data) {
            try {
              if (data && data.data && data.data.t_plan_document && data.data.t_plan_document.length > 0) {
                const results = normalize(data);
                ThunkAPI.dispatch(planDocumentsState.actions.setPlanDocumentsState(results.documents));
              } else {
                ThunkAPI.dispatch(planDocumentsState.actions.setPlanDocumentsState({documents:{}}));
              }
              resolve()
            } catch(e) {
              reject(e)
              debugger
              console.error('reactSubscribePlanDocuments exception', e);
            }
          },
          error(err) {
            reject(err)
            debugger
            console.error('reactSubscribePlanDocuments err', err);
          }
        })
      } else {
        reject()
      }
    })
  }
)


// Insert document
async function insertPlanDocument(planId, changes): Promise<DOCUMENT_TYPE> {
  return new Promise((resolve, reject) => {
    qqlClient.mutate({
      variables: {
        object: {
          plan_id: planId,
          name: changes.name,
          nodes: {
            data: [
              {
                data: {
                  rooms: changes.rooms || [],
                  devices: changes.devices || [],
                  rules: changes.rules || [],
                  scenes: changes.scenes || [],
                  type: 'root',
                  __typename: 'node',
                  name: '?'
                }
              }
            ]
          }
        }
      },
      mutation: INSERT_PLAN_DOCUMENT
    })
    .then((result) => {
      const queryResults = normalize(result);
      console.debug('SDK insertPlanDocument ok', queryResults);
      resolve(queryResults.documents);
    }).catch((error) => {
      debugger;
      console.error('SDK insertPlanDocument error:', error);
      reject(error);
    });
  });
}

/*
{
  "object": {
    "plan_id": "79089ab2-4e50-40b1-9b8a-a6cacab93373",
    "name": "uusi",
    "nodes": {
      "data": [
        {
          "data": {
            "rooms": [],
            "devices": [],
            "rules": [],
            "scenes": [],
            "type": "root",
            "name": "root"
          }
        }
      ]
    }
  }
}
*/

export const reactInsertPlanDocument = createAsyncThunk(
  'plans/insertPlanDocument',
  async (params, ThunkAPI) => {
    if (isAuth(ThunkAPI.getState())) {
      const {planId, changes} = params
      return await insertPlanDocument(planId, changes)
    }
  }
)


// Update Document
async function updatePlanDocument(uid, changes): Promise<DOCUMENT_TYPE> {
  return new Promise((resolve, reject) => {
    qqlClient.mutate({
      variables: {
        uid: uid,
        changes: changes
      },
      mutation: UPDATE_PLAN_DOCUMENT
    })
    .then((result) => {
      const queryResults = normalize(result);
      console.debug('SDK updatePlanDocument ok', queryResults);
      resolve(queryResults.documents);
    }).catch((error) => {
      debugger;
      console.error('SDK updatePlanDocument error:', error);
      reject(error);
    });
  });
}


export const reactUpdatePlanDocument = createAsyncThunk(
  'plans/updatePlanDocument',
  async (params, ThunkAPI) => {
    if (isAuth(ThunkAPI.getState())) {
      const {uid, changes} = params
      return await updatePlanDocument(uid, changes)
    }
  }
)

// Remove Plan
async function removePlanDocument(uid): Promise<DOCUMENT_TYPE> {
  return new Promise((resolve, reject) => {
    qqlClient.mutate({
      variables: {
        "uid": uid,
      },
      mutation: REMOVE_PLAN_DOCUMENT
    })
    .then((result) => {
      console.debug('SDK removePlanDocument ok', result);
      resolve(result);
    }).catch((error) => {
      debugger;
      console.error('SDK removePlanDocument error:', error);
      reject(error);
    });
  });
}


export const reactRemovePlanDocument = createAsyncThunk(
  'plans/removePlanDocument',
  async (params, ThunkAPI) => {
    if (isAuth(ThunkAPI.getState())) {
      const {uid, changes} = params
      return await removePlanDocument(uid, changes)
    }
  }
)

export const planDocumentsState = createSlice({
  name: 'documents',
  initialState: planDocumentsAdapter.getInitialState(),
  reducers: {
    setPlanDocumentsState(state, action) {
      const stateToSet = state;
      const newState = action.payload;
      planDocumentsAdapter.setAll(stateToSet, newState);
    },
  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [reactFetchPlanDocuments.fulfilled]: (state, action) => {
      planDocumentsAdapter.upsertMany(state, action.payload)
    },
    [reactFetchPlanDocuments.rejected]: (state, action) => {
      debugger
      console.error('SDK reactFetchPlanDocuments rejected');
    },
    [reactInsertPlanDocument.fulfilled]: (state, action) => {
      planDocumentsAdapter.updateOne(state, action.payload)
    },
    [reactInsertPlanDocument.rejected]: (state, action) => {
      debugger
      console.error('SDK reactInsertPlanDocument rejected');
    },
    [reactUpdatePlanDocument.fulfilled]: (state, action) => {
      planDocumentsAdapter.updateOne(state, action.payload)
    },
    [reactUpdatePlanDocument.rejected]: (state, action) => {
      debugger
      console.error('SDK reactUpdatePlanDocument rejected');
    },
    [reactRemovePlanDocument.fulfilled]: (state, action) => {
      planDocumentsAdapter.updateOne(state, action.payload)
    },
    [reactRemovePlanDocument.rejected]: (state, action) => {
      debugger
      console.error('SDK reactRemovePlanDocument rejected');
    },
  }
});


planDocumentsState.selectors = planDocumentsAdapter.getSelectors((state) => state.documents);

planDocumentsState.selectors.selectPlanDocuments = createSelector(
  [(state) => state.documents, (state, planId) => planId],
  (documents, planId) => {
    const ids = documents.ids.filter((id) => documents.entities[id].plan_id === planId)
    const entities = []
    ids.forEach((id) => {
      entities.push(documents.entities[id])
    });
    return entities;

  }
);
export const {
  selectById: reactSelectDocumentById,
  selectIds: reactSelectDocumentIds,
  selectEntities: reactSelectDocumentEntities,
  selectAll: reactSelectAllDocuments,
  selectTotal: reactSelectTotalDocuments,
} = planDocumentsAdapter.getSelectors(state => state.documents);
export const reactSelectPlanDocuments = planDocumentsState.selectors.selectPlanDocuments;


const { actions, reducer } = planDocumentsState;

/**
 * Plan Documents reducer
 * @type {function} reducer
 */
export { reducer as planDocumentsReducer };




