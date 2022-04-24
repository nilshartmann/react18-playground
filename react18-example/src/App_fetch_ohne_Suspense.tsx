import React, { Suspense, useTransition } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "react-query";
import { BlogPost } from "./types";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: false,
    },
  },
});

function App() {
  return (
    // Provide the client to your App

    <QueryClientProvider client={queryClient}>
      <BlogList />
    </QueryClientProvider>
  );
}

function getPosts() {
  return fetch("http://localhost:7000/posts?slow").then((response) =>
    response.json()
  );
}

function BlogList() {
  const { isLoading, isSuccess, data } = useQuery("posts", getPosts);
  console.log("query", isLoading, isSuccess, data);
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>BlogPosts</h1>
      <PostList posts={data} />
    </div>
  );
}

type PostListProps = {
  posts: BlogPost[];
};

function PostList({ posts }: PostListProps) {
  return (
    <>
      {posts.map((p) => (
        <article key={p.id} className="Container">
          <p className="Date">{p.date}</p>
          <h1>{p.title}</h1>
          <p>{p.body}</p>
        </article>
      ))}
    </>
  );
}

export default App;
