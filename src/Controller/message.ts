import { Message } from "../Interfaces/message";

  export const createMessage = ({id, senderId, receiverId, text, images }: Message) => ({
    id,
    senderId,
    receiverId,
    text,
    images,
    seen: false,
  });
  