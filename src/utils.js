// @flow

/**
 * Helper to check if run environment is Node
 * @type {Boolean}
 */
let isNodeInUse: boolean = false;

if (typeof process === 'object') {
  if (typeof process.versions === 'object') {
    if (typeof process.versions.node !== 'undefined') {
      isNodeInUse = true;
      console.log('Running in node.js');
    } else {
      console.log('Running in browser');
    }
  }
}

export const isNode = isNodeInUse;

/**
 * Helper method to Base64 decode
 * @param  {string} encoded - string to be decoded
 * @return {string}  - decoded string
 */
export function urlBase64Decode(encoded: string): string {
  const str = encoded.replace(/-/g, '+').replace(/_/g, '/');
  let output = str;
  switch (output.length % 4) {
    case 0:
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw new Error('Illegal base64url string!');
  }
  let retVal = '';

  let atob = (a: string) => { console.error('Invalid atob for string ', a); return 'invalid atob'; };
  if (!isNodeInUse) {
    atob = window.atob;
  } else {
    const nodeAtob = (a: string) => {
      const binVal = Buffer.from(a, 'base64').toString('binary');
      return binVal;
    };
    atob = nodeAtob;
  }

  try {
    retVal = atob(str);
  } catch (error) {
    try {
      retVal = atob(output);
    } catch (error2) {
      console.error('urlBase64Decode: trying atob failed');
    }
  }
  return retVal;
}
