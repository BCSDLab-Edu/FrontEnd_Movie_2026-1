import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/Logo.png";
import myPageIcon from "../../assets/myPageIcon.png";
import { getLoginCookie, removeLoginCookie } from "../../utils/cookie";
import "./Header.css";

interface HeaderProps {
  onSearch?: (keyword: string) => void;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  onSearchSubmit?: () => void;
}

function Header({
  onSearch,
  searchValue = "",
  onSearchValueChange,
  onSearchSubmit,
}: HeaderProps) {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loginUser, setLoginUser] = useState(getLoginCookie());

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (onSearchSubmit) {
      onSearchSubmit();
      return;
    }

    if (searchValue.trim() === "") return;
    onSearch?.(searchValue);
  }

  function handleGoLogin() {
    setIsMenuOpen(false);
    navigate("/login");
  }

  function handleGoSignup() {
    setIsMenuOpen(false);
    alert("회원가입 기능은 아직 준비 중입니다.");
  }

  function handleGoMyPage() {
    setIsMenuOpen(false);
    navigate("/mypage");
  }

  function handleLogout() {
    removeLoginCookie();
    setLoginUser(null);
    setIsMenuOpen(false);
    alert("로그아웃되었습니다.");
    navigate("/");
  }

  return (
    <header className="header">
      <button
        type="button"
        className="logo-button"
        onClick={() => navigate("/")}
        aria-label="홈으로 이동"
      >
        <img src={logoImg} alt="Movie Beginner Logo" />
      </button>
      <form className="search-box" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="검색"
          value={searchValue}
          onChange={(event) => onSearchValueChange?.(event.target.value)}
        />

        <button type="submit" className="search-btn" aria-label="검색">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 19L14.65 14.65M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z"
              stroke="#101828"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>

      <div className="mypage-menu-wrapper">
        <button
          type="button"
          className="mypage-button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="마이페이지 메뉴"
        >
          <img src={myPageIcon} alt="마이페이지" />
        </button>

        {isMenuOpen && (
          <div className="mypage-dropdown">
            {loginUser ? (
              <>
                <button
                  type="button"
                  className="dropdown-item logout"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={handleGoMyPage}
                >
                  마이페이지
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={handleGoLogin}
                >
                  로그인
                </button>

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={handleGoSignup}
                >
                  회원가입
                </button>

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={handleGoMyPage}
                >
                  마이페이지
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
