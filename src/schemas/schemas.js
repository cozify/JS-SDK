import { normalize, denormalize, schema } from "normalizr";


// See https://github.com/paularmstrong/normalizr/blob/master/docs/api.md
//
export const planEntity = new schema.Entity('plans', {}, { idAttribute: 'uid'} );
export const plansEntity = new schema.Array(planEntity);

export const documentEntity = new schema.Entity('documents', {}, { idAttribute: 'uid'} );
export const documentsEntity = new schema.Array(documentEntity);


const planSchema = new schema.Entity('plans');
const documentSchema = new schema.Entity('documents');
const planList = new schema.Array(planSchema);
planSchema.define({
  document: documentSchema,
});

export const getDocumentsFromPlan = (plans) => {
	debugger
	return normalize(plans, {
  	plans: planList,
	})

}


/*

// to normalize JSON tree to data
const locationTree = new schema.Entity('locations');
locationTree.define({
  child: [locationTree]
})
const locationSchema = [locationTree];

export const getLocationsFromDocument = (document) => {
  return {...normalize(document, locationSchema).entities.locations}
}


// to denormalize data to JSON tree
const locationDocument = new schema.Entity('locations');
locationDocument.define({
  child: [locationDocument]
})
const documentSchema = {locations: [locationDocument]};

export const getDocumentFromLocations = (locations) => {
  const denormalized = denormalize({ locations: ['root'] }, documentSchema, {locations: locations});
  return {root: denormalized.locations[0]}
}
*/