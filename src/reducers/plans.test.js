// import { configureStore } from '@reduxjs/toolkit';
// import deepFreeze from 'deep-freeze';
import { plansState, plansReducer, listPlans } from './plans';
import { store } from '../store';
// deepFreeze(state) to test state immutability

describe('Pure plansReducer', () => {
  // console.info('plansState: ', plansState);
  // console.info('plansReducer: ', plansReducer);
  it('should handle initial state', () => {
    const initialState = {
      entities: {},
      ids: [],
    };
    expect(plansReducer(undefined, {})).toEqual(initialState);
  });
});

describe('Set plans', () => {
  // console.info('plansState: ', plansState);
  // console.info('plansReducer: ', plansReducer);
  //
  it('should handle initial state', () => {
    const plans = [
      {
        "uid": "05bc4415-557b-4364-8a31-6ddeb8d5302f",
        "name": "Plan 1",
        "created_at": "2020-04-26T17:27:27.820457",
        "changed_at": "2020-04-26T17:27:58.093914",
        "documents": [
          {
            "uid": "d39e6ddc-6220-4c20-8c7d-9d01e65192de",
            "changed_at": "2020-04-26T17:27:27.820457",
            "created_at": "2020-04-26T17:27:27.820457",
            "room_types": [],
            "rule_types": [],
            "nodes": [
              {
                "uid": "4533068e-28b2-4cb8-a025-ee21bee8e972",
                "data": {
                  "name": "HUB 123",
                  "type": "HUB",
                  "rooms": [
                    "$LIVINGROOM"
                  ],
                  "rules": [],
                  "scenes": [],
                  "devices": []
                },
                "parent_id": null,
                "child": [
                  {
                    "uid": "0d62e0bc-1c29-4cb9-bc79-a39a9b59768f",
                    "parent_id": "4533068e-28b2-4cb8-a025-ee21bee8e972"
                  }
                ]
              },
              {
                "uid": "0d62e0bc-1c29-4cb9-bc79-a39a9b59768f",
                "data": {
                  "type": "TEST1"
                },
                "parent_id": "4533068e-28b2-4cb8-a025-ee21bee8e972",
                "child": [
                  {
                    "uid": "729d5a39-e1c0-4002-ab28-2edb31d94c8a",
                    "parent_id": "0d62e0bc-1c29-4cb9-bc79-a39a9b59768f"
                  }
                ]
              },
              {
                "uid": "729d5a39-e1c0-4002-ab28-2edb31d94c8a",
                "data": {
                  "type": "TEST1.1"
                },
                "parent_id": "0d62e0bc-1c29-4cb9-bc79-a39a9b59768f",
                "child": []
              },
              {
                "uid": "941faa4e-f477-468b-a1dc-3e57d590a121",
                "data": {
                  "type": "TEST2"
                },
                "parent_id": null,
                "child": []
              }
            ]
          }
        ]
      }
    ]
    // store.dispatch(listPlans()).then(() => {
    // });
    store.dispatch(plansState.actions.setPlansState(plans));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    console.log('Plans', storedPlans);
    console.info('plansState: ', stateNow);
    expect(storedPlans.entities['05bc4415-557b-4364-8a31-6ddeb8d5302f'].uid).toEqual('05bc4415-557b-4364-8a31-6ddeb8d5302f');
  });
});
