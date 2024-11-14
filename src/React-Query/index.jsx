import React, {useState} from "react";
import { useQuery, useMutation } from "react-query";
import axios from "axios";

const retrievePosts = async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts",
  );
  return response.data;
};

const DisplayPosts = () => {
  const {
    data: posts,
    error,
    isLoading,
  } = useQuery("postsData", retrievePosts);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const mutation = useMutation((newPost) =>
    axios.post("https://jsonplaceholder.typicode.com/posts", newPost),
  );

  if (isLoading) return <div>Fetching posts...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const submitData = () => {
    mutation.mutate({ title, body });
  };

  return (
    <>
    <div style={{margin: '20px'}}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        type="text"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Body"
      />
      <button onClick={submitData}>Submit</button>
    </div>
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
    </>
  );
};

export default DisplayPosts;