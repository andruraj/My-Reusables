/**
 * Sets a cookie with the given name, value, and expiration time in seconds.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value to be stored in the cookie.
 * @param {number} [exp=604800000] - The expiration time of the cookie in milliseconds (default is 7 days).
 * @param {string} [path='/'] - The path on the server where the cookie is available.
 * @param {boolean} [secure=false] - Indicates if the cookie should only be transmitted over HTTPS.
 * @throws {Error} If name or value is missing or if exp is not a number.
 */
function setCookie(name, value, exp = 604800000, path = "/", secure = false) {
  if (!name || !value) {
    throw new Error("Name and value are required to set a cookie.");
  }

  if (typeof exp !== "number") {
    throw new Error("Expiration time must be a number.");
  }

  const expires = exp
    ? new Date(exp > Date.now() ? exp : Date.now() + exp).toUTCString()
    : "";

  if (getCookie(name)) {
    console.warn("Cookie with name '" + name + "' already exists. Updating...");
  }

  let secureFlag = secure ? "; secure" : "";
  document.cookie =
    name + "=" + value + "; expires=" + expires + "; path=" + path + secureFlag;
}

/**
 * Gets the value of the cookie with the given name.
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string|null} The value of the cookie, or null if not found or expired.
 */
function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

/**
 * Updates the value and expiration of the cookie with the given name.
 * @param {string} name - The name of the cookie to update.
 * @param {string} value - The new value to be stored in the cookie.
 * @param {number} [exp=604800] - The expiration time of the cookie in seconds (default is 7 days).
 * @param {string} [path='/'] - The path on the server where the cookie is available.
 * @param {boolean} [secure=false] - Indicates if the cookie should only be transmitted over HTTPS.
 */
function updateCookie(name, value, exp = 604800, path = "/", secure = false) {
  deleteCookie(name, path);
  setCookie(name, value, exp, path, secure);
}

/**
 * Deletes the cookie with the given name.
 * @param {string} name - The name of the cookie to delete.
 * @param {string} [path='/'] - The path on the server where the cookie is available.
 */
function deleteCookie(name, path = "/") {
  document.cookie =
    name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + path + ";";
}

/**
 * Deletes all cookies.
 */
function deleteAllCookies() {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim().split("=")[0];
    deleteCookie(cookie);
  }
}

export { setCookie, getCookie, updateCookie, deleteCookie, deleteAllCookies };
