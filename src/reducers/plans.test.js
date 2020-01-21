// import { configureStore } from 'redux-starter-kit';
// import deepFreeze from 'deep-freeze';
import { plansState, plansReducer } from './plans';
import { store } from '../store';
// deepFreeze(state) to test state immutability

describe('Pure plansReducer', () => {
  it('should handle initial state', () => {
    const initialState = {
      roomNames: [],
      sceneTypes: [],
      deviceTypes: [],
      ruleTypes: [],
      templates: {},
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
    };
    expect(plansReducer(undefined, {})).toEqual(initialState);
  });
});

/*
**
*/

describe('Room names ', () => {
  it('will be initally empty', () => {
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    expect(storedPlans.roomNames).toEqual([]);
  });
  it('addRoomName will add room name', () => {
    store.dispatch(plansState.actions.addRoomName('$TEST1'));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);

    // console.log('Plans after setTemplates', storedPlans);
    expect(storedPlans.roomNames).toEqual(['$TEST1']);
  });
  it('addRoomName will not add room name twice', () => {
    store.dispatch(plansState.actions.addRoomName('$TEST1'));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);

    // console.log('Plans after setTemplates', storedPlans);
    expect(storedPlans.roomNames).toEqual(['$TEST1']);
  });
  it('removeRoomName will not fail if room is not there', () => {
    store.dispatch(plansState.actions.removeRoomName('$TEST11'));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);

    // console.log('Plans after setTemplates', storedPlans);
    expect(storedPlans.roomNames).toEqual(['$TEST1']);
  });
  it('removeRoomName will not remove room', () => {
    store.dispatch(plansState.actions.removeRoomName('$TEST1'));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);

    // console.log('Plans after setTemplates', storedPlans);
    expect(storedPlans.roomNames).toEqual([]);
  });
});


/*
** Templates
*/

describe('Templates ', () => {
  it('setTemplates and addTemplate will add templates with id', () => {
    const template1 = {
      id: '111',
      data: {
        name: 'testiI',
      },
    };
    const templates = { templates: { 111: template1 } };
    const template1ToBe = {
      id: 'TEMPLATE:111',
      data: {
        name: 'testiI',
      },
    };

    store.dispatch(plansState.actions.setTemplates(templates));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);

    // console.log('Plans after setTemplates', storedPlans);
    expect(storedPlans.templates['TEMPLATE:111']).toEqual(template1ToBe);


    const template2 = { id: 112, other: 'testiII' };
    const template2ToBe = { id: 'TEMPLATE:112', other: 'testiII' };
    store.dispatch(plansState.actions.addTemplate(template2));
    const stateNowII = store.getState();
    const storedPlansII = plansState.selectors.getPlans(stateNowII);

    // console.log('Plans after addTemplate', storedPlansII);
    expect(storedPlansII.templates['TEMPLATE:112']).toEqual(template2ToBe);
  });

  it('setTemplate will modify existing template', () => {
    const template = {
      id: 'TEMPLATE:112',
      name: 'testiIII',
    };
    store.dispatch(plansState.actions.setTemplate(template));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Plans after setTemplate', JSON.stringify(storedPlans.templates));
    expect(storedPlans.templates['TEMPLATE:112']).toEqual(template);
  });

  it('removeTemplate will remove template', () => {
    const template = {
      id: 'TEMPLATE:112',
      name: 'testiIII',
    };
    store.dispatch(plansState.actions.removeTemplate(template.id));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Plans after removeTemplate', storedPlans);
    expect(storedPlans.templates['112']).not.toBeDefined();
    expect(storedPlans.templates['TEMPLATE:112']).not.toBeDefined();
  });

  it('addTemplate will add template without id', () => {
    const template = {
      data: {
        name: '1H + K',
      },
    };
    const templateToBe = {
      id: 'TEMPLATE:1H+K',
      data: {
        name: '1H + K',
      },
    };
    store.dispatch(plansState.actions.addTemplate(template));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Templates after addTemplate', storedPlans);
    expect(storedPlans.templates['TEMPLATE:1H+K']).toEqual(templateToBe);
  });
});


/*
 * Locations
*/
describe('Locations ', () => {
  it('addLocationNode will add country 1 to empty locations', () => {
    const country = {
      id: 'country-1',
      data: {
        name: 'fi',
      },
    };
    const countryStored = {
      id: 'root:country-1',
      data: {
        name: 'fi',
      },
      childIds: [],
    };
    store.dispatch(plansState.actions.addLocationNode({ parentId: null, newNode: country }));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations after addLocationNode country 1', JSON.stringify(storedPlans.locations));
    expect(storedPlans.locations['root:country-1']).toEqual(countryStored);
  });

  it('addLocationNode will add country 2 ', () => {
    const country = {
      id: 'country-2',
      data: {
        name: 'en',
      },
    };
    const countryStored = {
      id: 'root:country-2',
      data: {
        name: 'en',
      },
      childIds: [],
    };
    store.dispatch(plansState.actions.addLocationNode({ parentId: null, newNode: country }));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations after addLocationNode country 2:', JSON.stringify(storedPlans.locations));
    expect(storedPlans.locations['root:country-2']).toEqual(countryStored);
  });


  it('setLocationNode will change country 1 data (name)', () => {
    const country = {
      id: 'root:country-1',
      data: {
        name: 'Finland',
      },
    };
    const countryToBe = {
      id: 'root:Finland',
      data: {
        name: 'Finland',
      },
      childIds: [],
    };
    store.dispatch(plansState.actions.setLocationNode(country));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);

    // console.log('Locations after setLocationNode country 1:', JSON.stringify(storedPlans.locations));
    // console.log('Locations after setLocationNode country 1:', JSON.stringify(storedPlans.locations['root:Finland']));
    expect(storedPlans.locations['root:Finland']).toEqual(countryToBe);
  });


  it('addLocationNode will add city 1', () => {
    const city = {
      id: 'city-1',
      data: {
        name: 'Hel',
      },
    };
    const cityStored = {
      id: 'root:country-2:city-1',
      data: {
        name: 'Hel',
      },
      childIds: [],
    };
    store.dispatch(plansState.actions.addLocationNode({ parentId: 'root:country-2', newNode: city }));
    // console.log('City after addLocationNode city 1', JSON.stringify(city));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations after addLocationNode city 1', JSON.stringify(storedPlans.locations));
    expect(storedPlans.locations['root:country-2:city-1']).toEqual(cityStored);
  });


  it('addLocationNode will add address 1', () => {
    const address = {
      id: 'address-1',
      data: {
        name: 'Erottaja',
      },
    };
    const addressStored = {
      id: 'root:country-2:city-1:address-1',
      data: {
        name: 'Erottaja',
      },
      childIds: [],
    };
    store.dispatch(plansState.actions.addLocationNode({ parentId: 'root:country-2:city-1', newNode: address }));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations after addLocationNode address 1', JSON.stringify(storedPlans.locations));
    expect(storedPlans.locations['root:country-2:city-1:address-1']).toEqual(addressStored);
  });


  it('removeLocationNode will remove address 1', () => {
    // const stateNow = store.getState();
    // const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations before removeLocationNode address 1', storedPlans);
    store.dispatch(plansState.actions.removeLocationNode('root:country-2:city-1:address-1'));
    const stateNowI = store.getState();
    const storedPlansI = plansState.selectors.getPlans(stateNowI);
    // console.log('Locations after removeLocationNode address 1', JSON.stringify(storedPlansI.locations));
    // console.log('City childIds after removeLocationNode address1', storedPlansI.locations['root:country-2:city-1'].childIds);
    expect(storedPlansI.locations['root:country-2:city-1'].childIds).toHaveLength(0);
    expect(storedPlansI.locations['root:country-2:city-1:address-1']).not.toBeDefined();
  });


  it('addLocationNode will add city Tku', () => {
    const city = {
      data: {
        name: 'Tku',
      },
    };
    const cityStored = {
      id: 'root:Finland:Tku',
      data: {
        name: 'Tku',
      },
      childIds: [],
    };
    store.dispatch(plansState.actions.addLocationNode({ parentId: 'root:Finland', newNode: city }));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations after addLocationNode city:', JSON.stringify(storedPlans.locations));
    expect(storedPlans.locations['root:Finland:Tku']).toEqual(cityStored);
  });


  it('addLocationNode will add address Aura to Tku', () => {
    const address = {
      data: {
        name: 'Aura',
      },
    };

    const addressStored = {
      id: 'root:Finland:Tku:Aura',
      data: {
        name: 'Aura',
      },
      childIds: [],
    };

    store.dispatch(plansState.actions.addLocationNode({ parentId: 'root:Finland:Tku', newNode: address }));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations after addLocationNode address:', JSON.stringify(storedPlans.locations));
    expect(storedPlans.locations['root:Finland:Tku:Aura']).toEqual(addressStored);
  });


  it('addLocationNode will add buildin 1 to Aura of Tku', () => {
    const building = {
      data: {
        name: '1',
      },
    };
    const storedBuilding = {
      id: 'root:Finland:Tku:Aura:1',
      data: {
        name: '1',
      },
      childIds: [],
    };
    store.dispatch(plansState.actions.addLocationNode({ parentId: 'root:Finland:Tku:Aura', newNode: building }));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations after addLocationNode building: ', JSON.stringify(storedPlans.locations));
    expect(storedPlans.locations['root:Finland:Tku:Aura:1']).toEqual(storedBuilding);
  });

  it('setLocationNode will change building 1 to 2', () => {
    const building = {
      id: 'root:Finland:Tku:Aura:1',
      data: {
        name: '2',
        open: false,
      },
    };
    const buildingToBe = {
      id: 'root:Finland:Tku:Aura:2',
      data: {
        name: '2',
        open: false,
      },
      childIds: [],
    };
    store.dispatch(plansState.actions.setLocationNode(building));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);

    // console.log('Locations after setLocationNode building 2:', JSON.stringify(storedPlans.locations));
    // console.log('Locations after setLocationNode building 2:', JSON.stringify(storedPlans.locations['root:Finland']));
    expect(storedPlans.locations['root:Finland:Tku:Aura:2']).toEqual(buildingToBe);
    expect(storedPlans.locations['root:Finland:Tku:Aura:1']).not.toBeDefined();
  });

  it('removeLocationNode will remove address Aura', () => {
    // const stateNow = store.getState();
    // const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations before removeLocationNode address Aura:', storedPlans.locations);
    store.dispatch(plansState.actions.removeLocationNode('root:Finland:Tku:Aura'));
    const stateNowI = store.getState();
    const storedPlansI = plansState.selectors.getPlans(stateNowI);
    // console.log('Locations after removeLocationNode address Aura:', JSON.stringify(storedPlansI.locations));
    // console.log('City childIds after removeLocationNode address Aura:', storedPlans.locations['root:Finland:Tku'].childIds);
    expect(storedPlansI.locations['root:Finland:Tku'].childIds).toHaveLength(0);
    expect(storedPlansI.locations['root:Finland:Tku:Aura']).not.toBeDefined();
    expect(storedPlansI.locations['root:Finland:Tku:Aura:2']).not.toBeDefined();
  });


  it('removeLocationNode will remove country Finland', () => {
    // const stateNow = store.getState();
    // const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations before removeLocationNode country 1', storedPlans.locations);
    store.dispatch(plansState.actions.removeLocationNode('root:Finland'));
    const stateNowI = store.getState();
    const storedPlansI = plansState.selectors.getPlans(stateNowI);
    // console.log('Locations after removeLocationNode country 1', JSON.stringify(storedPlansI.locations));
    // console.log('Root childIds after removeLocationNode country 1', storedPlansI.locations.root.childIds);
    expect(storedPlansI.locations.root.childIds).toHaveLength(1);
    expect(storedPlansI.locations['root:Finland']).not.toBeDefined();
    expect(storedPlansI.locations['root:Finland:Tku']).not.toBeDefined();
  });


  it('removeLocationNode will remove country 2', () => {
    // const stateNow = store.getState();
    // const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations before removeLocationNode country 2', storedPlans.locations);
    store.dispatch(plansState.actions.removeLocationNode('root:country-2'));
    const stateNowI = store.getState();
    const storedPlansI = plansState.selectors.getPlans(stateNowI);
    // console.log('Locations after removeLocationNode country 2', JSON.stringify(storedPlansI.locations));
    // console.log('Root childIds after removeLocationNode country 2', storedPlansI.locations.root.childIds);
    expect(storedPlansI.locations.root.childIds).toHaveLength(0);
    expect(storedPlansI.locations['root:country-2']).not.toBeDefined();
  });


  it('addLocationNode will add address 1 to root', () => {
    const address = {
      data: {
        name: 'Erottaja',
      },
    };
    const addressStored = {
      id: 'root:Erottaja',
      data: {
        name: 'Erottaja',
      },
      childIds: [],
    };
    store.dispatch(plansState.actions.addLocationNode({ parentId: null, newNode: address }));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations after addLocationNode address 1', JSON.stringify(storedPlans.locations));
    expect(storedPlans.locations['root:Erottaja']).toEqual(addressStored);
  });

  it('removeLocationNode will remove address 1 from root', () => {
    // const stateNow = store.getState();
    // const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations before removeLocationNode address 1', storedPlans.locations);
    store.dispatch(plansState.actions.removeLocationNode('root:Erottaja'));
    const stateNowI = store.getState();
    const storedPlansI = plansState.selectors.getPlans(stateNowI);
    // console.log('Locations after removeLocationNode address 1', JSON.stringify(storedPlansI.locations));
    // console.log('Root childIds after removeLocationNode country 2', storedPlansI.locations.root.childIds);
    expect(storedPlansI.locations.root.childIds).toHaveLength(0);
    expect(storedPlansI.locations.root.Erottaja).not.toBeDefined();
  });
});
