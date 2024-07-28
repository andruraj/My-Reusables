/**
 *
 * @param {object} obj - Object with props
 * @param {[string]} keys - Array of property names
 * @returns {any} - Result value of the key
 */
export const getNestedValueByKey = (obj, keys) => {
  return keys
    .split(".")
    .reduce((acc, key) => (acc && acc[key] ? acc[key] : undefined), obj);
};
