import { useEffect, useState } from "react";
import Post from "../Post";
import { API_URL } from "../../config"; 


export default function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/api/post`).then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);
  return <>{posts.length > 0 && posts.map((post) => <Post {...post} />)}</>;
}
