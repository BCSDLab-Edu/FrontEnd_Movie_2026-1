import { create } from "zustand";

type ToastType = "review" | "favorite";

/*상태가 5개라서 많지 않아 유지해도괜찮으나
위계를 나누고싶다면: message, type 묶어서 Toast 하나 만들고
show와 hide는 함수 (=액션) 둘을 나눠서 사용가능 
상태 늘어나거나 복잡해졌을 때 좀 더 간결하게 적용 가능

실제: state로 해서 
AuthState라고 해서 토큰, 타입
Action으로 해서 묶어놓기 

ex 코드 

type State = {
  token: string;
  refreshToken: string;
  userType: UserType;
};

type Actions = {
  setToken: (token:string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setUserType: (userType: UserType) => void; 
}


*/

type ToastState = {
  isOpen: boolean;
  message: string;
  type: ToastType | null;
  showToast: (message: string, type: ToastType) => void;
  hideToast: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  isOpen: false,
  message: "",
  type: null,

  showToast: (message, type) => {
    set({
      isOpen: true,
      message,
      type,
    });
  },

  hideToast: () => {
    set({
      isOpen: false,
      message: "",
      type: null,
    });
  },
}));
