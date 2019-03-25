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
 * @method objMergeDeep(): Deep merge two objects, mainly used to update Store objects.
 * @param target
 * @param ...sources
 */
export function objMergeDeep(target, source) {
  let res: any;

  if (isObject(target) && isObject(source)) {
    res = Object.assign({}, target);

    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(res, { [key]: source[key] });
        } else {
          res[key] = objMergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(res, { [key]: source[key] });
      }
    });
  }

  return res;
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
