/**
 * will not encode +@?=:#;,$& to their http-encoded equivalents (as & and + are common URL operators)
 * @param {string} str
 * @returns - encoded string
 */
export function fixedEncodeURI(str) {
  return encodeURI(str).replace(/%5B/g, "[").replace(/%5D/g, "]");
}

/**
 * will encode +@?=:#;,$& to their http-encoded equivalents
 * @param {string} str
 * @returns
 */
export function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16);
  });
}
