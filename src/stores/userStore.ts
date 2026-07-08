import { create } from "zustand";
import {
  getLoginCookie,
  removeLoginCookie,
  setLoginCookie,
} from "../utils/cookie";

type UserState = {
  nickname: string;
  isLoggedIn: boolean;
  login: (nickname: string) => void;
  logout: () => void;
  initializeUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  nickname: "",
  isLoggedIn: false,

  login: (nickname) => {
    setLoginCookie(nickname);

    set({
      nickname,
      isLoggedIn: true,
    });
  },

  logout: () => {
    removeLoginCookie();

    set({
      nickname: "",
      isLoggedIn: false,
    });
  },

  initializeUser: () => {
    const loginUser = getLoginCookie();

    if (!loginUser) {
      set({
        nickname: "",
        isLoggedIn: false,
      });
      return;
    }

    set({
      nickname: loginUser,
      isLoggedIn: true,
    });
  },
}));
