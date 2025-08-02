import { getCookie, setCookie, removeCookie } from "./cookie";

export const getToken = () => {
  return getCookie('token');
};

export const setToken = (token, days = 7) => {
  setCookie('token', token, days);
};

export const removeToken = () => {
  removeCookie('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};