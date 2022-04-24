import React, { Suspense, useTransition } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "react-query";
import { BlogPost, Comment } from "./types";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

let l = 0;

function App() {
  const [postId, setPostId] = React.useState<string | null>(null);

  function handlePostClick(newPostId: string) {
    setPostId(newPostId);
  }

  l = l + 1;
  console.log("Render", l);

  return <h1>Hello {l}</h1>;

  // return (
  //   // Provide the client to your App

  //   <QueryClientProvider client={queryClient}>
  //     <h1>Blog App</h1>
  //     <React.Suspense fallback={<h1>Waiting for Data...</h1>}>
  //       {postId === null ? (
  //         <BlogList onPostClick={handlePostClick} />
  //       ) : (
  //         <SinglePostPage postId={postId} onHomeClick={() => setPostId(null)} />
  //       )}
  //     </React.Suspense>
  //   </QueryClientProvider>
  // );
}

function getPosts() {
  return fetch("http://localhost:7000/posts?slow").then((response) =>
    response.json()
  );
}

function getPost(postId: string): Promise<BlogPost> {
  return fetch(`http://localhost:7000/posts/${postId}?slow`).then((response) =>
    response.json()
  );
}

function getComments(postId: string): Promise<Comment[]> {
  return fetch(`http://localhost:7000/posts/${postId}/comments?slow`).then(
    (response) => response.json()
  );
}

type BlogListProps = {
  onPostClick(newPostId: string): void;
};

function BlogList({ onPostClick }: BlogListProps) {
  const { data } = useQuery<BlogPost[]>("posts", getPosts);

  const id = React.useId();

  return (
    <>
      {data!.map((p) => (
        <article key={p.id} className="Container">
          <p className="Date">{p.date}</p>
          <h1>
            {p.title} <code>({id.toString()})</code>
          </h1>

          <NavButton
            onClick={() => onPostClick(p.id)}
            label={"Read Post " + p.id}
          />
        </article>
      ))}
    </>
  );
}

type NavButtonProps = {
  onClick(): void;
  label: string;
};
function NavButton({ onClick, label }: NavButtonProps) {
  const [pending, startTransition] = React.useTransition();

  function handleClick() {
    startTransition(onClick);
  }
  return (
    <button disabled={pending} onClick={handleClick}>
      {pending ? "Waiting..." : label}
    </button>
  );
}

type SinglePostProps = {
  postId: string;
  onHomeClick(): void;
};

function SinglePostPage({ postId, onHomeClick }: SinglePostProps) {
  const { data } = useQuery(["post", postId], () => getPost(postId));

  const p = data!;

  return (
    <div>
      <button onClick={onHomeClick}>Home</button>
      <SinglePost postId={postId} />
      {/* <React.Suspense fallback={<h1>Loading Comments</h1>}> */}
      <Comments postId={postId} />
      {/* </React.Suspense> */}
    </div>
  );
}

function SinglePost({ postId }: { postId: string }) {
  const { data } = useQuery(["post", postId], () => getPost(postId));
  const p = data!;

  return (
    <div>
      <article key={p.id} className="Container">
        <p className="Date">{p.date}</p>
        <h1>{p.title}</h1>
        <p>{p.body}</p>
      </article>
    </div>
  );
}

function Comments({ postId }: { postId: string }) {
  const { data } = useQuery(["comments", postId], () => getComments(postId));
  const id = React.useId();
  const p = data!;

  return (
    <div>
      <p>Id: {id.toString()}</p>
      {p.map((comment) => (
        <CommentView key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

function CommentView({ comment }: { comment: Comment }) {
  const id = React.useId();
  return (
    <div>
      {comment.comment} id: {id.toString()}
    </div>
  );
}

export default App;
