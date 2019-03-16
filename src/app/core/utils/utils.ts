/**
 * Gonzalo Chacón
 */

/**
 * @method isObject(): Simple object check.
 * @param item
 */
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * @method mergeDeep(): Deep merge two objects, mainly used to update Store objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, source) {
  const output = Object.assign({}, target);

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

/**
 * @method isEqual(): This method compares two given objects, or arrays, to check if they are equal.
 * @param value
 * @param other
 */
export function isEqual(value, other): boolean {

  // Get the value type
  const type = Object.prototype.toString.call(value);

  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) { return false; }

  // If items are not an object or array, return false
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) { return false; }

  // Compare the length of the length of the two items
  const valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
  const otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) { return false; }

  // Compare two items
  const compare = (item1, item2) => {

    // Get the object type
    const itemType = Object.prototype.toString.call(item1);

    // If an object or array, compare recursively
    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) { return false; }
    } else { // Otherwise, do a simple comparison

    // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(item2)) { return false; }

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === '[object Function]') {
        if (item1.toString() !== item2.toString()) { return false; }
      } else {
        if (item1 !== item2) { return false; }
      }

    }
  };

  // Compare properties
  if (type === '[object Array]') {
    for (let i = 0; i < valueLen; i++) {
      if (!compare(value[i], other[i])) { return false; }
    }
  } else {
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        if (!compare(value[key], other[key])) { return false; }
      }
    }
  }

  // If nothing failed, return true

  return true;
}

/**
 * @method mergeArrays()
 * @param arr1
 * @param arr2
 */
export function mergeArrays(arr1, arr2) {
  const newArray = [...arr1, ...arr2];
  return newArray.filter((elem, pos, arr) => {
    return arr.indexOf(elem) === pos;
  });
}

/**
 * @method getCookie()
 * @param name
 */
export function getCookie(name) {
  const pair = document.cookie.match(new RegExp(`${name}=([^;]+)`));
  return !!pair ? pair[1] : null;
}

/**
 * @method setCookie()
 * @param name
 * @param value
 * @param expDays
 */
export function setCookie({ name = '', value = '', expDays = 0 }) {
  const d = new Date();
  d.setTime(d.getTime() + (expDays * 24 * 60 * 60 * 1000));

  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

/**
 * @method deleteCookie(): Sets cookie.
 * @param name
 */
export function deleteCookie(name: string, domain?: string) {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${domain || location.host};`;
}
