import { rand_string } from "./lib/util";
import { uid } from "react-uid";
let data = {
  users: [
    {
      id: uid(rand_string()),
      username: "admin",
      password: "admin"
    },
    {
      id: uid(rand_string()),
      username: "user",
      password: "user"
    }
  ],
  posts: [
    {
      id: uid(rand_string()),
      author: "user",
      title: "title",
      category: "education",
      content: "content"
    },
    {
      id: uid(rand_string()),
      author: "user",
      title: "title",
      category: "travel",
      content: "content"
    }
  ],
  comments: [],
  attachments: [],
  current_user: undefined,
  current_user_type: undefined,
  current_post: undefined
};

export default data;
