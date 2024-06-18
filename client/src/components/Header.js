import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {UserContext} from './context/UserContext';

function Header() {
const {userInfo,setUserInfo}=useContext(UserContext);
  useEffect(() => {
    fetch("http://localhost:4000/api/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch("http://localhost:4000/api/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }
  const userEmail=userInfo?.email;

  return (
    <header>
      <Link to="/" className="logo">
        MyBlog
      </Link>
      <nav>
        {userEmail && (
          <>
            <Link to="/create">Create New Post</Link>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!userEmail && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
