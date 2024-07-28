import { isEmpty } from "./isEmpty";

export /**
 *
 *
 * @param {object} obj
 * @return {object}
 */
const cleanObj = (obj) => {
  const newObj = JSON.parse(JSON.stringify(obj));
  for (var propName in newObj) {
    if (isEmpty(newObj[propName])) {
      delete newObj[propName];
    }
  }
  return newObj;
};
