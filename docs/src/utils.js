// 

/**
 * Helper to check if run environment is Node
 * @type {Boolean}
 */
let isNodeInUse = false;

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

let atobC = (a) => { console.error('Invalid atob for string ', a); return 'invalid atob'; };

if (!isNodeInUse) {
  atobC = window.atob;
} else {
  const nodeAtob = (a) => {
    const binVal = Buffer.from(a, 'base64').toString('binary');
    return binVal;
  };
  atobC = nodeAtob;
}

/**
 * Helper method to strip HTML presentation from string
 * @param  {string} html - HTML presentation
 * @return {string}  - text string
 */
export function getTextFromNode(givenHTML) {
  let html = givenHTML;
  html = html.replace(/<\/div>/ig, ''); // '\n');
  html = html.replace(/<\/li>/ig, '');
  html = html.replace(/<li>/ig, '');
  html = html.replace(/<\/ul>/ig, '');
  html = html.replace(/<\/p>/ig, '');
  // eslint-disable-next-line
  html = html.replace(/<br\s*[\/]?>/gi, '');
  html = html.replace(/<[^>]+>/ig, '');
  html = html.replace(/\s\s+/g, ' ');
  return html.trim();
}

/**
 * Helper method to get HTML presentation from unicode decoded base64 string
 * @param  {string} encoded - string to be decoded
 * @return {string}  - decoded string
 */
export function b64DecodeUnicode(encoded) {
  try {
    // eslint-disable-next-line
    return decodeURIComponent(Array.prototype.map.call(atobC(encoded), function(c) {
      // eslint-disable-next-line
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (error) {
    console.error('b64DecodeUnicode: trying atob failed');
    return 'b64DecodeUnicode error';
  }
}


/**
 * Helper method to Base64 decode
 * @param  {string} encoded - string to be decoded
 * @return {string}  - decoded string
 */
export function urlBase64Decode(encoded) {
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

  let atob = (a) => { console.error('Invalid atob for string ', a); return 'invalid atob'; };
  if (!isNodeInUse) {
    atob = window.atob;
  } else {
    const nodeAtob = (a) => {
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
