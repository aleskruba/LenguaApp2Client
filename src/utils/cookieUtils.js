// cookieUtils.js
import Cookies from 'js-cookie';

export function getCookie(name) {
  return Cookies.get(name);
}

export function getAllCookies() {
  return Cookies.get();
}
