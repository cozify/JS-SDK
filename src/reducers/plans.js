// @flow
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  createSelector
} from "@reduxjs/toolkit";

import type { PLANS_TYPE, PLAN_TYPE } from './constants';

import { GET_PLANS, SUBS_PLANS, INSERT_PLAN, UPDATE_PLAN, REMOVE_PLAN, qqlClient, normalize, isAuth } from '../qql.js'


/*
** addOne: accepts a single entity, and adds it.
** addMany: accepts an array of entities or an object in the shape of Record<EntityId, T>, and adds them.
** setAll: accepts an array of entities or an object in the shape of Record<EntityId, T>, and replaces the existing entity contents with the values in the array.
** removeOne: accepts a single entity ID value, and removes the entity with that ID if it exists.
** removeMany: accepts an array of entity ID values, and removes each entity with those IDs if they exist.
** updateOne: accepts an "update object" containing an entity ID and an object containing one or more new field values to update inside a changes field, and performs a shallow update on the corresponding entity.
** updateMany: accepts an array of update objects, and performs shallow updates on all corresponding entities.
** upsertOne: accepts a single entity. If an entity with that ID exists, it will perform a shallow update and the specified fields will be merged into the existing entity, with any matching fields overwriting the existing values. If the entity does not exist, it will be added.
** upsertMany: accepts an array of entities or an object in the shape of Record<EntityId, T> that will be shallowly upserted.
*/
const plansAdapter = createEntityAdapter({
  // Assume IDs are stored in a field uid
  selectId: (plan) => {
    // console.log('SDK plansAdapter: ', plan);
    return plan.uid;
  },
  // Keep the "all IDs" array sorted based on plan names
  sortComparer: (a, b) => b.changed_at.localeCompare(a.changed_at)
})

// Fetch all plans
async function fetchPlans(): Promise<PLANS_TYPE> {
  return new Promise((resolve, reject) => {
    qqlClient.query({
      query: GET_PLANS
    })
    .then((result) => {
      const queryResults = normalize(result);
      console.debug('SDK fetchPlans ok', queryResults);
      resolve(queryResults.plans);
    }).catch((error) => {
      debugger;
      console.error('SDK fetchPlans error:', error);
      reject(error);
    });
  });
}

export const reactFetchPlans = createAsyncThunk(
  'plans/fetchPlans',
  async (params, ThunkAPI) => {
    if (isAuth(ThunkAPI.getState())) {
      return await fetchPlans()
    }
  },
  {
    condition: (params, { getState, extra }) => {
      debugger
      const state = getState()
    }
  },
)

// Subscribe
export const reactSubscribePlans  = createAsyncThunk(
  'plans/subscribePlans',
  async (params, ThunkAPI) => {
    return new Promise((resolve, reject) => {
      if (isAuth(ThunkAPI.getState())) {
        const subsHandle = qqlClient.subscribe({
          query: SUBS_PLANS,
          //variables: { },
        }).subscribe({
          next(data) {
            try {
              if (data && data.data && data.data.t_plan &&data.data.t_plan.length > 0) {
                const results = normalize(data);
                // plansAdapter.setAll(ThunkAPI.getState(), results.plans)
                ThunkAPI.dispatch(plansState.actions.setPlansState(results.plans));
              } else {
                ThunkAPI.dispatch(plansState.actions.setPlansState({plans:{}}));
              }
              resolve()
            } catch(e) {
              reject(e)
              debugger
              console.error('reactSubscribePlans exception', e);
            }
          },
          error(err) {
            reject(err)
            debugger
            console.error('reactSubscribePlans err', err);
          }
        })
      } else {
        reject()
      }
    })
  }
)

// Insert plan
async function insertPlan(name): Promise<PLAN_TYPE> {
  return new Promise((resolve, reject) => {
    qqlClient.mutate({
      variables: {
        object: {
          name: name,
          documents: {
            data: [
              {
                name: "?"
              }
            ]
          }
        }
      },
      mutation: INSERT_PLAN
    })
    .then((result) => {
      const queryResults = normalize(result);
      console.debug('SDK insertPlan ok', queryResults);
      resolve(queryResults.plans);
    }).catch((error) => {
      debugger;
      console.error('SDK insertPlan error:', error);
      reject(error);
    });
  });
}


export const reactInsertPlan = createAsyncThunk(
  'plans/insertPlan',
  async (params, ThunkAPI) => {
    if (isAuth(ThunkAPI.getState())) {
      const { name } = params
      return await insertPlan(name)
    }
  }
)


// Update Plan
async function updatePlan(uid, changes): Promise<PLAN_TYPE> {
  return new Promise((resolve, reject) => {
    qqlClient.mutate({
      variables: {
        uid: uid,
        changes: changes
      },
      mutation: UPDATE_PLAN
    })
    .then((result) => {
      const queryResults = normalize(result);
      console.debug('SDK updatePlan ok', queryResults);
      resolve(queryResults.plans);
    }).catch((error) => {
      debugger;
      console.error('SDK updatePlan error:', error);
      reject(error);
    });
  });
}


export const reactUpdatePlan = createAsyncThunk(
  'plans/updatePlan',
  async (params, ThunkAPI) => {
    if (isAuth(ThunkAPI.getState())) {
      const {uid, changes} = params
      return await updatePlan(uid, changes)
    }
  }
)

// Remove Plan
async function removePlan(uid): Promise<PLAN_TYPE> {
  return new Promise((resolve, reject) => {
    qqlClient.mutate({
      variables: {
        "uid": uid,
      },
      mutation: REMOVE_PLAN
    })
    .then((result) => {
      console.debug('SDK removePlan ok', result);
      resolve(result);
    }).catch((error) => {
      debugger;
      console.error('SDK removePlan error:', error);
      reject(error);
    });
  });
}


export const reactRemovePlan = createAsyncThunk(
  'plans/removePlan',
  async (params, ThunkAPI) => {
    if (isAuth(ThunkAPI.getState())) {
      const {uid, changes} = params
      return await removePlan(uid, changes)
    }
  }
)

// Slice
export const plansState = createSlice({
  name: 'plans',
  initialState: plansAdapter.getInitialState(),
  reducers: {
    setPlansState(state, action) {
      const stateToSet = state;
      const newState = action.payload;
      const oldState = stateToSet.plansState;
      plansAdapter.setAll(state, newState);
      //console.log(`SDK setPlansState: PLANS state ${oldState} -> ${newState}`);
      //console.info('plans.js setPlansState: newState', newState)

      /*
      const normalized = normalize(newState, plansEntity);
      console.info('plans.js setPlansState: normalized plans', normalized)//.entities.plans)

      Object.entries(normalized.entities.plans).forEach(([id, plan]) => {

        console.info('plans.js document from plan:', JSON.stringify(plan.document));

        const locations = getLocationsFromDocument(plan.document)
        console.info('plans.js locations tree:', JSON.stringify(locations));
        plan.locations = locations;

        const document = getDocumentFromLocations(plan.locations)
        console.info('plans.js document from tree:', JSON.stringify(document))
      });
      plansAdapter.setAll(state, normalized.entities.plans)
      */

      // const normalized = normalize(newState, plansEntity);
      // console.info('plans.js setPlansState: normalized plans', normalized)
      /*
      Object.entries(normalized.entities.plans).forEach(([id, plan]) => {
        //const documents = normalize(plan, sEntity);
        //const normalizedDocuments = normalize(documents, documentsEntity);
        //Object.entries(normalizedDocuments.entities.documents).forEach(([id, docuement]) => {
          debugger
        //});

      });
      plansAdapter.setAll(state, normalized.entities.plans)
      */
    },
    // listPlans: listPlans,

  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [reactFetchPlans.fulfilled]: (state, action) => {
      debugger
      plansAdapter.upsertMany(state, action.payload)
    },
    [reactFetchPlans.rejected]: (state, action) => {
      debugger
      console.error('SDK reactFetchPlans rejected');
    },
    [reactInsertPlan.fulfilled]: (state, action) => {
      plansAdapter.updateOne(state, action.payload)
    },
    [reactInsertPlan.rejected]: (state, action) => {
      debugger
      console.error('SDK reactInsertPlan rejected');
    },
    [reactUpdatePlan.fulfilled]: (state, action) => {
      plansAdapter.updateOne(state, action.payload)
    },
    [reactUpdatePlan.rejected]: (state, action) => {
      debugger
      console.error('SDK reactFetchPlans rejected');
    },
    [reactRemovePlan.fulfilled]: (state, action) => {
      plansAdapter.updateOne(state, action.payload)
    },
    [reactRemovePlan.rejected]: (state, action) => {
      debugger
      console.error('SDK reactRemovePlan rejected');
    },
  }
});


plansState.selectors = plansAdapter.getSelectors((state) => state.plans);
plansState.selectors.getPlans = plansState.selectors.selectEntities


const { actions, reducer } = plansState;
// console.info('plans.js: actions', actions)
// console.info('plans.js: reducer', reducer)
// console.info('plans.js: plansState', plansState)

/**
 * Plans reducer
 * @type {function} reducer
 */
export { reducer as plansReducer };

// Extract and export each action creator by name
/*
export const {
  updateHubs, selectHub, unSelectHub, setHubConnectionState,
} = actions;
*/

export const {
  selectById: reactSelectPlanById,
  selectIds: reactSelectPlanIds,
  selectEntities: reactSelectPlanEntities,
  selectAll: reactSelectAllPlans,
  selectTotal: reactSelectTotalPlans
} = plansAdapter.getSelectors(state => state.plans);

