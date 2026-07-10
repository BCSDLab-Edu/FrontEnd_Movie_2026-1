import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";

const queryClient = new QueryClient({
  //리액트 쿼리의 전역 설정 및 캐시 저장소 역할
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1분 //데이터를 신선한 상태로 취급하는 시간
      gcTime: 1000 * 60 * 5, // 5분 //아무 컴포넌트도 그 쿼리를 사용하지 않을 때 캐시를 메모리에서 얼마나 더 보관할지 정하는 시간
      retry: 1, //실패했을 때 재시도 하는 횟수
      refetchOnWindowFocus: false, //브라우저의 다른 탭을 보고 왔을 때 refetch 여부
    },
    mutations: {
      retry: 0,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);

//리액트 쿼리 서버 상태를 효율적으로 가져오고 캐싱하며 업데이트하기 위한 데이터 패칭 라이브러리
// queryclient의 역할 전역으로 쿼리 데이터를 관리,쿼리 캐싱,쿼리 상태 업데이트 ,캐시 무효화
