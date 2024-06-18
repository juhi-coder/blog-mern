import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {UserContext} from './context/UserContext';
import { API_URL } from "../config";


function Header() {
const {userInfo,setUserInfo}=useContext(UserContext);
  useEffect(() => {
    fetch(`${API_URL}/api/profile`, {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch(`${API_URL}/logout`, {
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
