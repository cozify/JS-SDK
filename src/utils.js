// @flow

/* Helper to check run environment */
export let isNode: boolean = false;
if (typeof process === 'object') {
  if (typeof process.versions === 'object') {
    if (typeof process.versions.node !== 'undefined') {
      isNode = true;
      console.log("Running in node.js");
    } else {
      console.log("Running in browser");
    }
  }
}
