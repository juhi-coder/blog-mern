import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import Editor from "../Editor";
import { Navigate, useParams } from "react-router-dom";
import { API_URL } from "../../config";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setReDirect] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.title);
        setSummary(postInfo.summary);
        setContent(postInfo.content);
      });
    });
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (files?.[0]) {
      data.set("file", files[0]);
    }

    console.log([...data.entries()]); // Log the FormData content for debugging

    try {
      const response = await fetch(`${API_URL}/api/post`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });
      if (response.ok) {
        setReDirect(true);
      } else {
        const errorText = await response.text();
        console.error("Error updating post:", response.statusText, errorText);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
    <form onSubmit={updatePost}>
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
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: "7px" }}>Edit Post</button>
    </form>
  );
}
