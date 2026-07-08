import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import { useUserStore } from "../stores/userStore";
import "./LoginPage.css";

function LoginPage() {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (nickname.trim() === "") {
      alert("닉네임을 입력해주세요.");
      return;
    }

    login(nickname.trim());
    alert("로그인되었습니다.");
    navigate("/mypage");
  }

  return (
    <>
      <Header
        searchValue=""
        onSearchValueChange={() => {}}
        onSearchSubmit={() => {}}
      />

      <main className="login-page">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>로그인</h1>

          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            type="text"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
          />

          <button type="submit">로그인</button>
        </form>
      </main>
    </>
  );
}

export default LoginPage;
