import { ApolloClient, split, HttpLink, InMemoryCache } from '@apollo/client';
import {GraphQLNormalizr} from 'graphql-normalizr'
import { gql } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/link-ws';

/*
import { SubscriptionClient } from 'graphql-subscriptions-client';
// set up the client, which can be reused
const qqlSubscriptionClient = new SubscriptionClient('ws://localhost:8080/v1/graphql', {
  reconnect: true,
});
*/

/* 
Commented out as graphql not used 
const httpLink = new HttpLink({
  uri: 'http://localhost:8080/v1/graphql'
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:8080/v1/graphql`,
  options: {
    reconnect: true
  }
});


// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const isAuth = (state) => {
  const { user } = state
  const { authKey } = user;
  if (!user || !user.authKey) {
    // Already fetched or in progress, don't need to re-fetch
    console.error('SDK listPlans error: No userKey!');
    return false;
  }
  return true;
}

const createApolloClient = (authToken) => {
  if (window && window.location && window.location.hostname === 'localhost') {
    return new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
    });
  }
  return null;
};

export const qqlClient = createApolloClient(null);


export const { normalize } = new GraphQLNormalizr(
  {
    idKey: 'uid',
    exclude: { t_plan_document_node: [ 'data' ] },
    typeMap: {
      t_plan: 'plans',
      t_plan_document: 'documents',
      t_plan_document_node: 'nodes',
    }
});
*/

// Fake client
export const qqlClient = {
  query: () => {},
  subscribe: () => {},
  mutate: () => {}
}
export const { normalize } =  () => {};
export const isAuth = (state) => {};


export const GET_PLAN_DOCUMENTs_AND_NODES = gql`
  query ListPlansDocumentAndNodes {
    t_plan {
      uid
      name
      created_at
      changed_at
      documents {
        uid
        plan_id
        changed_at
        created_at
        device_types
        scene_types
        template_types
        room_types
        rule_types
        nodes {
          uid
          data
          parent_id
          child {
            uid
            parent_id
          }
        }
      }
    }
  }
`;

export const SUBS_PLANS = gql`
  subscription SubsPlans {
     t_plan {
      uid
      name
      created_at
      changed_at
    }
  }
`;


export const GET_PLANS = gql`
  query ListPlans {
    t_plan {
      uid
      name
      created_at
      changed_at
    }
  }
`;


export const INSERT_PLAN = gql`
 mutation InsertPlanWithDocument($object: t_plan_insert_input!) {
  insert_t_plan_one(object: $object) {
    changed_at
    created_at
    uid
    documents {
      uid
      name
      nodes {
        uid
      }
      changed_at
      created_at
    }
  }
}
`;



export const UPDATE_PLAN = gql`
  mutation UpdatePlan($uid: String, $changes: t_plan_set_input) {
    update_t_plan(where: {uid: {_eq: $uid}}, _set: $changes) {
      affected_rows
      returning {
        uid
        name
        created_at
        changed_at
      }
    }
  }
`;

export const REMOVE_PLAN = gql`
  mutation DeletePlan($uid: String!) {
    delete_t_plan_by_pk(uid: $uid) {
      name
    }
  }
`;



export const GET_PLAN_DOCUMENTS = gql`
  query ListDocuments($plan_id: String) {
    t_plan_document(where: {plan_id: {_eq: $plan_id}}) {
      uid
      author
      name
      created_at
      changed_at
      plan_id
    }
  }
`;

export const SUBS_PLAN_DOCUMENTS = gql`
  subscription SubsPlanDocuments($plan_id: String)  {
    t_plan_document(where: {plan_id: {_eq: $plan_id}}) {
      uid
      author
      name
      created_at
      changed_at
      plan_id
    }
  }
`;
export const INSERT_PLAN_DOCUMENT = gql`
  mutation InsertDocumentToPlan($object: t_plan_document_insert_input!) {
    insert_t_plan_document_one(object: $object) {
      uid
      name
      author
      changed_at
      created_at
      nodes {
        changed_at
        created_at
        data
      }
    }
  }
`;

// 
// export const UPDATE_PLAN_DOCUMENT = gql`
//   mutation UpdateDocument($room_types: jsonb, $rule_types: jsonb, $uid: String) {
//     update_t_plan_document(where: {uid: {_eq: $uid}}, _set: {room_types: $room_types, rule_types: $rule_types}) {
//       affected_rows
//       returning {
//         uid
//         room_types
//         rule_types
//         scene_types
//         template_types
//         device_types
//       }
//     }
//   }
// `;
// 
export const UPDATE_PLAN_DOCUMENT = gql`
  mutation UpdatePlanDocument($uid: String, $changes: t_plan_document_set_input) {
    update_t_plan_document(where: {uid: {_eq: $uid}}, _set: $changes) {
      affected_rows
      returning {
        uid
        name
        author
        created_at
        changed_at
      }
    }
  }
`;

export const REMOVE_PLAN_DOCUMENT = gql`
  mutation DeleteDocumentAndAllNodes($uid: String!) {
    delete_t_plan_document_node(where: {document_id: {_eq: $uid}}) {
      affected_rows
    }
    delete_t_plan_document(where: {uid: {_eq: $uid}}){
      affected_rows
    }
  }
`;

// Nodes
export const GET_PLAN_DOCUMENT_NODES = gql`
  query ListNodess($document_id: String) {
    t_plan_document_node(where: {document_id: {_eq: $document_id}}) {
      uid
      created_at
      changed_at
      document_id
      data
    }
  }
`;

export const SUBS_PLAN_DOCUMENT_NODES = gql`
  subscription SubsPlanDocuments($document_id: String)  {
    t_plan_document_node(where: {document_id: {_eq: $document_id}}) {
      uid
      parent_id
      child{
        uid
      }
      created_at
      changed_at
      document_id
      data
    }
  }
`;



export const INSERT_PLAN_DOCUMENT_NODE = gql`
  mutation InsertNode($object: t_plan_document_node_insert_input!) {
    insert_t_plan_document_node_one(object: $object) {
      uid
      changed_at
      created_at
      data
    }
  }
`;



// export const UPDATE_PLAN_DOCUMENT_NODE = gql`
//   mutation UpdateDocument($room_types: jsonb, $rule_types: jsonb, $uid: String) {
//     update_t_plan_document_node(where: {uid: {_eq: $uid}}, _set: {room_types: $room_types, rule_types: $rule_types}) {
//       affected_rows
//       returning {
//         uid
//       }
//     }
//   }
// `;

export const UPDATE_PLAN_DOCUMENT_NODE = gql`
  mutation UpdateDocumentNode($uid: String, $changes: t_plan_document_node_set_input) {
    update_t_plan_document_node(where: {uid: {_eq: $uid}}, _set: $changes) {
      returning {
        data
        changed_at
        created_at
      }
      affected_rows
    }
  }
`;

export const REMOVE_PLAN_DOCUMENT_NODE = gql`
  mutation DeletePlanDocumentNode($uid: String!) {
    delete_t_plan_document_node_by_pk(uid: $uid) {
      uid
    }
  }
`;
