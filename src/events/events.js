// @flow

/**
 * Really simply proxy to expose an emitter instance to be used across modules
 */
import mitt from 'mitt'

export const events: mitt.Emitter = mitt()


