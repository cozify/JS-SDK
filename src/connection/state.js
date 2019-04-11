// @flow

import type { CLOUD_CONNECTION_STATE_TYPE } from './constants.js';
import { connectionsState, connectionsReducer } from "../reducers/connections";
import { hubsState, hubsReducer } from "../reducers/hubs"
import {getStore} from "../store.js"

/**
 * Change Cloud connection state
 * @param {[type]} value: CLOUD_CONNECTION_STATE_TYPE [description]
 */
export function setCloudConnectionState(value: CLOUD_CONNECTION_STATE_TYPE) {
    getStore().dispatch(connectionsState.actions.setCloudConnectionState(value));
}

/**
 * Change hub connection state
 * @param {Object} hubAndSate hubId and new state
 */
export function setHubConnectionState(hubAndSate) {
    getStore().dispatch(hubsState.actions.setHubConnectionState(hubAndSate));
}
