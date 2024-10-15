export type Todo = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}
export type TodoProps = {
  todo:Todo;
  toggleComplete: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, newText: string) => void;
};






export type User = {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
 
}