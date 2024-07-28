/**
 * Function to extract integer value from a tag attribute.
 * @param {string} str - The string to extract the value from.
 * @param {string} attrName - The name of the tag attribute to extract.
 * @returns {string|null} - Returns the integer value if found, otherwise null.
 */
export const getInt = (str, attrName) => {
  const regex = new RegExp(`\\b${attrName}=["']{1}([\\d]+)["']{1}`, "gm");
  const match = str.match(regex);
  return match ? parseInt(match[0].match(/\d+/)[0]) : null;
};
