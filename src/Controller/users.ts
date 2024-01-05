import { User } from "../Interfaces/users";


export let users: User[] = [];

const addUser = (userId: string, socketId?: string) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId: string) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiverId: string) => {
  return users.find((user) => user.userId === receiverId);
};

  export { 
    addUser, 
    removeUser, 
    getUser
  };
  