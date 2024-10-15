import React, { useState  } from 'react';
import { useTodo } from './context/pageContext';


const User = () => {
  const {addUser} =useTodo()
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addUser(username, email, isActive);
    setUsername('');
    setEmail('');
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
        required
      />
       <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
        required
        />
        <label>
        Active:
        <input type="checkbox" checked={isActive} onChange={() => setIsActive(!isActive)} />
      </label>
      <button type="submit">Добавить пользователя</button>
    </form>
  );
};

export default User;
