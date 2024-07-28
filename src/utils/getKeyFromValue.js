/**
 * Returns the key for the value in an object
 * @param {string | number | object} value - Value
 * @param {object} obj - Object
 * @returns {string}
 */
export const getKeyByValue = (value, obj) => {
  for (let key in obj) {
    if (obj[key] === value) {
      return key;
    }
  }
  return null; // Return null if value is not found
};
