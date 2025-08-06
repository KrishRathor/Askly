import { EVENTS, IJoinRoom, IMcqAnswer, IStartInteraction } from "@/type/type";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ISocketProvider {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendRoomJoinEvent: (data: IJoinRoom) => void;
  startInteraction: (data: IStartInteraction) => void;
  sendMcqAnswer: (data: IMcqAnswer) => void;
  question: IQuesiton | undefined;
  votes: any
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);
  return state;
};

interface IQuesiton {
  title: string;
  options: string[];
  id: string;
}

interface IData {
  data: IStartInteraction;
}

export const SocketProvider: React.FC<ISocketProvider> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [question, setQuestion] = useState<IQuesiton | undefined>();
  const [votes, setVotes] = useState<any>();

  const sendRoomJoinEvent: ISocketContext["sendRoomJoinEvent"] = useCallback(
    (data: IJoinRoom) => {
      const { id } = data;
      socket?.emit(EVENTS.JOIN_ROOM, {
        id,
      });
    },
    [socket]
  );

  const startInteraction: ISocketContext["startInteraction"] = useCallback(
    (data: IStartInteraction) => {
      const { id, rid } = data;
      console.log("start interaction called with ", id, rid);
      socket?.emit(EVENTS.START_INTERACTION, data);
    },
    [socket]
  );

  const sendMcqAnswer: ISocketContext["sendMcqAnswer"] = useCallback(
    (data: IMcqAnswer) => {
      console.log("sending mcq answer", data);
      socket?.emit(EVENTS.MCQ_ANSWER, data);
    },
    [socket]
  );

  const onMcqResponse = useCallback((data: IMcqAnswer) => {
    console.log("recieve mcq response", data);
    //@ts-ignore
    setVotes(data.votes);
  }, []);

  const onStartInteractionResponse = useCallback((data: IData) => {
    console.log("received reply", data.data.title);
    setQuestion({
      title: data.data.title,
      options: data.data.options,
      id: data.data.id,
    });
  }, []);

  useEffect(() => {
    const _socket = io(`https://askly-socket.onrender.com`, {
      query: {
        userToken: localStorage.getItem("username"),
      },
    });

    _socket.on(EVENTS.START_INTERACTION_RESPONSE, onStartInteractionResponse);
    _socket.on(EVENTS.MCQ_ANSWER_RESPONSE, onMcqResponse);

    setSocket(_socket);

    return () => {
      _socket.off(
        EVENTS.START_INTERACTION_RESPONSE,
        onStartInteractionResponse
      );
      _socket.off(EVENTS.MCQ_ANSWER_RESPONSE, onMcqResponse);

      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        sendRoomJoinEvent,
        startInteraction,
        question: question,
        votes: votes,
        sendMcqAnswer,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
