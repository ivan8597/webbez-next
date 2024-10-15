import React, { createContext, use, useContext, useEffect, useState } from "react";
import { Todo, User } from "../type";
import axios from "axios";


export type TodoContextType = {
  todos: Todo[];
   
  addUser: (text: string,email:string,is_active:boolean) => void;
  addTodo: (text: string,userId: number) => void;
  toggleComplete: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, newText: string) => void;
 
}
const TodoContext = createContext( {} as TodoContextType);


export const useTodo = () => {
  return useContext(TodoContext);
};
export const TodoProvider = ({ children } : { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [users, setUsers] = useState<User[]>([]);


  const addTodo = (text: string,userId: number) => {
    if (text) {
      fetch('http://127.0.0.1:8000/api/todos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: text,
          description:"example",
          completed: false,
          user:userId
        }),
      })
        .then((response) => response.json())
        .then((data) => setTodos([...todos, data]));

    
    }
  };

  const toggleComplete = (id: number) => {
    fetch(`http://127.0.0.1:8000/api/todos/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completed: !todos.find((todo) => todo.id === id)?.completed,
      }),
    })
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    fetch(`http://127.0.0.1:8000/api/todos/${id}/`, {
      method: 'DELETE',
      
    })
    .then((response)=>{
      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
      }
      else{
        console.log("error")
      }
    })
    // setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id: number, newText: string) => {
    fetch(`http://127.0.0.1:8000/api/todos/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newText,
        description:"example",
      }),
    })
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, title: newText } : todo))
    );
  };




  const addUser = (text: string,email:string,is_active:boolean) => {
    if (text) {
      fetch('http://127.0.0.1:8000/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: text,
          email:email,
          is_active: is_active
        }),
      })
        .then((response) => response.json())
        .then((data) => setUsers([...users, data]));
    }
  }
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/todos/')
    .then(response => response.json())
    .then(data => setTodos(data))
  },[])
  // useEffect(() => {
  //   fetch('http://127.0.0.1:8000/api/users/')
  //   .then(response => response.json())
  //   .then(data => setUsers(data))
  // })
  return (
    <TodoContext.Provider
      value={{
        todos,

        addUser,
        addTodo,
        toggleComplete,
        deleteTodo,
        editTodo,
       
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

