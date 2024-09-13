import { User } from "../core/types";




export type ReplyForm = {
  entity_type: "note" | "message";
  entity_id: number | null;
  reply_id: number | null;
  reply_user_id: number;
};
export type ReplyToForm = {
  mode: "edit" | "reply";
  id: string;
};


export type Post = {
  id: string;
  namespace: string;
  model: string;
  model_id: string;
  reply_to: string | null;
  quote_to: string | null;
  mentions: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
  text: string;
  user_annotated: User;

};

export type NewPost = Omit<Post, "id">;
// у заметки reply_to должен быть null
export type PostNote = Post & {
  reply_to: null | "null";
};
//  у сообщения reply_to не должен быть null
export type PostMessage = Post & {
  reply_to: string;
};
// export type PostMessage = Post & {
//   reply_to: string;
// } & {
//   reply_to: string; // Делаем поле reply_to обязательным
// };

export type PostNode = Post & {
  children?: PostNode[]; //
};

//user_annotated: {id: "6628caaa7fa96bce3e114760", username: "panov", last_name: null, first_name: null}


