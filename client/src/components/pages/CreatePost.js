import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import { API_URL } from "../../config";
import "react-quill/dist/quill.snow.css";
import { getToken } from "../../utils/auth";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setReDirect] = useState(false);

  async function createNewPost(ev) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    ev.preventDefault();
    console.log(files);

    const token = getToken(); // Get the token from localStorage
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${API_URL}/blog/post`, {
      method: "POST",
      body: data,
      headers: headers,
      credentials: "include",
    });
    if (response.ok) {
      setReDirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="title"
        placeholder={"Title"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        placeholder={"Summary"}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: "7px" }}>Create Post</button>
    </form>
  );
}

export default CreatePost;
