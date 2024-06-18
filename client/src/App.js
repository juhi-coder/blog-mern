import "./App.css";
import Home from "./components/pages/Home";
import Layout from "./components/Layout";
import { Route, Routes } from "react-router-dom";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import { UserContextProvider } from "./components/context/UserContext";
import CreatePost from "./components/pages/CreatePost";
import PostPage from "./components/pages/PostPage";
import EditPost from "./components/pages/EditPost";
function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<EditPost />} />

        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
