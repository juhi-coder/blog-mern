import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { API_URL } from "../config";
import { getToken, setToken, removeToken } from "../utils/auth"; // Import token management functions

function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const userEmail = userInfo?.email;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = getToken();
        if (!token) return; // No token available, handle as needed

        const response = await fetch(`${API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUserInfo(userData);
        } else {
          console.error(
            "Failed to fetch user profile:",
            response.status,
            response.statusText
          );
          setUserInfo(null); // Clear user info if profile fetch fails
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserInfo(null); // Clear user info on error
      }
    };

    fetchUserProfile();
  }, [setUserInfo]);

  function logout() {
    fetch(`${API_URL}/auth/logout/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      credentials: "include",
    })
      .then(() => {
        removeToken(); // Clear token from localStorage
        setUserInfo(null); // Clear user info in context
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  }

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
