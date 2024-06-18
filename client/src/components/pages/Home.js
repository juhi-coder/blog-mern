import { useEffect, useState } from "react";
import Post from "../Post";

export default function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("blog-mern-aeswa9erw-juhis-projects-210887f5.vercel.app/api/post").then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);
  return <>{posts.length > 0 && posts.map((post) => <Post {...post} />)}</>;
}
