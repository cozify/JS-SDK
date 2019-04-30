// 

/**
 * Helper method to Base64 decode
 * @param  {string} encoded - string to be decoded
 * @return {string}  - decoded string
 */
export function urlBase64Decode(encoded) {
  let str = encoded.replace(/-/g, "+").replace(/_/g, "/");
  let output = str;
  switch (output.length % 4) {
      case 0:
      case 2:
          output += "==";
          break;
      case 3:
          output += "=";
          break;
      default:
          throw "Illegal base64url string!"
  }
  var retVal = "";

  let atob = function(a) {};
  if(!isNode){
    atob  = window.atob;
  } else {
    atob = function(a) {
      return new Buffer(a, 'base64').toString('binary');
    };
  }

  try {
        retVal = atob(str);
  } catch(error){
      try {
        retVal = atob(output);
      } catch(error){
        console.error( "urlBase64Decode: trying atob failed");
      }
  }
  return retVal

}

/**
 * Helper to check if run environment is Node
 * @type {Boolean}
 */
export let isNode = false;
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
