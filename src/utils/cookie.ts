const LOGIN_COOKIE_KEY = "movieLoginUser";

export function setLoginCookie(nickname: string) {
  document.cookie = `${LOGIN_COOKIE_KEY}=${nickname}; path=/; max-age=86400`;
}

export function getLoginCookie() {
  const cookies = document.cookie.split("; ");

  const loginCookie = cookies.find((cookie) =>
    cookie.startsWith(`${LOGIN_COOKIE_KEY}=`),
  );

  if (!loginCookie) {
    return null;
  }

  return loginCookie.split("=")[1];
}

export function removeLoginCookie() {
  document.cookie = `${LOGIN_COOKIE_KEY}=; path=/; max-age=0`;
}

export function isLoggedIn() {
  return getLoginCookie() !== null;
}
