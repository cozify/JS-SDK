// import { configureStore } from 'redux-starter-kit';
// import deepFreeze from 'deep-freeze';
import { plansState, plansReducer } from './plans';
import { store } from '../store';
// deepFreeze(state) to test state immutability

describe('Pure plansReducer', () => {
  it('should handle initial state', () => {
    const initialState = {
      templates: {},
      installations: {},
      locations: {
        root: {
          id: 'root',
          childIds: [],
        },
      },
    };
    expect(plansReducer(undefined, {})).toEqual(initialState);
  });
});

/*
describe('Store plansReducer', () => {
  it('setTemplates and addTemplate will add template', () => {
    const template1 = { id: 111, name: 'testiI' };
    const templates = { templates: { 111: template1 } };

    store.dispatch(plansState.actions.setTemplates(templates));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);

    console.log('Plans after setTemplates', storedPlans);
    expect(storedPlans.templates['111']).toEqual(template1);


    const template2 = { id: 112, name: 'testiII' };
    store.dispatch(plansState.actions.addTemplate(template2));
    const stateNowII = store.getState();
    const storedPlansII = plansState.selectors.getPlans(stateNowII);

    console.log('Plans after addTemplate', storedPlansII);
    expect(storedPlansII.templates['112']).toEqual(template2);
  });

  it('setPlan will modify existing template', () => {
    const template = {
      id: '112',
      name: 'testiIII',
    };
    store.dispatch(plansState.actions.setTemplate(template));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    console.log('Plans after setTemplate', storedPlans);
    expect(storedPlans.templates['112']).toEqual(template);
  });

  it('removePlan will remove template', () => {
    const template = {
      id: '112',
      name: 'testiIII',
    };
    store.dispatch(plansState.actions.removeTemplate(template));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    console.log('Plans after removeTemplate', storedPlans);
    expect(storedPlans.templates['112']).not.toBeDefined();
  });

  it('setInstallations and addinstallation will add installation', () => {
    const installation1 = { id: 111, name: 'testiI' };
    const installations = { installations: { 111: installation1 } };

    store.dispatch(plansState.actions.setInstallations(installations));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);

    console.log('Plans after setInstallations', storedPlans);
    expect(storedPlans.installations['111']).toEqual(installation1);


    const installation2 = { id: 112, name: 'testiII' };
    store.dispatch(plansState.actions.addInstallation(installation2));
    const stateNowII = store.getState();
    const storedPlansII = plansState.selectors.getPlans(stateNowII);

    console.log('Plans after addInstallation', storedPlansII);
    expect(storedPlansII.installations['112']).toEqual(installation2);
  });

  it('setInstallation will modify existing INSTALLATION', () => {
    const installation = {
      id: '112',
      name: 'testiIII',
    };
    store.dispatch(plansState.actions.setInstallation(installation));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    console.log('Plans after setInstallation', storedPlans);
    expect(storedPlans.installations['112']).toEqual(installation);
  });

  it('removeinstallation will remove installation', () => {
    const installation = {
      id: '112',
      name: 'testiIII',
    };
    store.dispatch(plansState.actions.removeInstallation(installation));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    console.log('Plans after removeInstallation', storedPlans);
    expect(storedPlans.installations['112']).not.toBeDefined();
  });
});

describe('Templates ', () => {
  it('addTemplate will add template to empty plan', () => {
    const template = {
      id: 'template-1',
      name: '1H + K',
    };
    store.dispatch(plansState.actions.addTemplate(template));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    console.log('Templates after addTemplate', storedPlans);
    expect(storedPlans.templates['template-1']).toEqual(template);
  });
});
*/

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
    // console.log('Locations after addLocationNode country 2', JSON.stringify(storedPlans.locations));
    expect(storedPlans.locations['root:country-2']).toEqual(countryStored);
  });


  it('setLocationNode will change country 1 data (name)', () => {
    const country = {
      id: 'root:country-1',
      data: {
        name: 'Finland',
      },
    };
    store.dispatch(plansState.actions.setLocationNode(country));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);

    // console.log('Locations after setLocationNode country 1 data', JSON.stringify(storedPlans.locations));
    expect(storedPlans.locations['root:country-1']).toEqual(country);
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


  it('addLocationNode will add city 2', () => {
    const city = {
      id: 'city-2',
      data: {
        name: 'Tku',
      },
    };
    const cityStored = {
      id: 'root:country-1:city-2',
      data: {
        name: 'Tku',
      },
      childIds: [],
    };
    store.dispatch(plansState.actions.addLocationNode({ parentId: 'root:country-1', newNode: city }));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations after addLocationNode city 2', JSON.stringify(storedPlans.locations));
    expect(storedPlans.locations['root:country-1:city-2']).toEqual(cityStored);
  });


  it('addLocationNode will add address 3', () => {
    const address = {
      id: 'address-3',
      data: {
        name: 'Aura',
      },
    };

    const addressStored = {
      id: 'root:country-1:city-2:address-3',
      data: {
        name: 'Aura',
      },
      childIds: [],
    };

    store.dispatch(plansState.actions.addLocationNode({ parentId: 'root:country-1:city-2', newNode: address }));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations after addLocationNode address 3', JSON.stringify(storedPlans.locations));
    expect(storedPlans.locations['root:country-1:city-2:address-3']).toEqual(addressStored);
  });


  it('addLocationNode will add buildin 1', () => {
    const building = {
      id: 'building-1',
      data: {
        name: '1',
      },
    };
    const storedBuilding = {
      id: 'root:country-1:city-2:address-3:building-1',
      data: {
        name: '1',
      },
      childIds: [],
    };
    store.dispatch(plansState.actions.addLocationNode({ parentId: 'root:country-1:city-2:address-3', newNode: building }));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations after addLocationNode building 1', JSON.stringify(storedPlans.locations));
    expect(storedPlans.locations['root:country-1:city-2:address-3:building-1']).toEqual(storedBuilding);
  });


  it('removeLocationNode will remove address 3', () => {
    // const stateNow = store.getState();
    // const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations before removeLocationNode address 3', storedPlans.locations);
    store.dispatch(plansState.actions.removeLocationNode('root:country-1:city-2:address-3'));
    const stateNowI = store.getState();
    const storedPlansI = plansState.selectors.getPlans(stateNowI);
    // console.log('Locations after removeLocationNode address 3', JSON.stringify(storedPlansI.locations));
    // console.log('City childIds after removeLocationNode address 3', storedPlans.locations['root:country-1:city-2'].childIds);
    expect(storedPlansI.locations['root:country-1:city-2'].childIds).toHaveLength(0);
    expect(storedPlansI.locations['root:country-1:city-2:address-3']).not.toBeDefined();
  });


  it('removeLocationNode will remove country 1', () => {
    // const stateNow = store.getState();
    // const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations before removeLocationNode country 1', storedPlans.locations);
    store.dispatch(plansState.actions.removeLocationNode('root:country-1'));
    const stateNowI = store.getState();
    const storedPlansI = plansState.selectors.getPlans(stateNowI);
    // console.log('Locations after removeLocationNode country 1', JSON.stringify(storedPlansI.locations));
    // console.log('Root childIds after removeLocationNode country 1', storedPlansI.locations.root.childIds);
    expect(storedPlansI.locations.root.childIds).toHaveLength(1);
    expect(storedPlansI.locations['root:country-1']).not.toBeDefined();
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
      id: 'address-1',
      data: {
        name: 'Erottaja',
      },
    };
    const addressStored = {
      id: 'root:address-1',
      data: {
        name: 'Erottaja',
      },
      childIds: [],
    };
    store.dispatch(plansState.actions.addLocationNode({ parentId: null, newNode: address }));
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    // console.log('Locations after addLocationNode address 1', JSON.stringify(storedPlans.locations));
    expect(storedPlans.locations['root:address-1']).toEqual(addressStored);
  });


  it('removeLocationNode will remove address 1 from root', () => {
    const stateNow = store.getState();
    const storedPlans = plansState.selectors.getPlans(stateNow);
    console.log('Locations before removeLocationNode address 1', storedPlans.locations);
    store.dispatch(plansState.actions.removeLocationNode('root:address-1'));
    const stateNowI = store.getState();
    const storedPlansI = plansState.selectors.getPlans(stateNowI);
    console.log('Locations after removeLocationNode address 1', JSON.stringify(storedPlansI.locations));
    console.log('Root childIds after removeLocationNode country 2', storedPlansI.locations.root.childIds);
    expect(storedPlansI.locations.root.childIds).toHaveLength(0);
    expect(storedPlansI.locations.root['address-1']).not.toBeDefined();
  });
});
