export type BlogPost = {
  id: string;
  title: string;
  body: string;
  date: string;
};

export type NewBlogPost = {
  title: string;
  body: string;
};

export type Comment = {
  id: string;
  comment: string;
};
