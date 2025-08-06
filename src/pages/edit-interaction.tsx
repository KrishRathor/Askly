import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import Image from "next/image";
import { GetServerSideProps } from "next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/utils/api";
import { Mcq } from "@/components/event/Mcq";
import { WordCloud } from "@/components/event/WordCloud";
import { TextQuestion } from "@/components/event/TextQuestion";
import { useSocket } from "@/context/SocketProvider";

interface EditProps {
  id: string;
}

interface ICard {
  title: string;
  votes: number;
  type: Type;
  id: string;
  options?: string[] | undefined;
  setSelectedQuestion: React.Dispatch<React.SetStateAction<IQuestion | null>>;
  setSelectedQuestionType: React.Dispatch<React.SetStateAction<Type>>;
}

enum Type {
  MCQ,
  WordCloud,
  Text,
  None,
}

interface IMcq {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  options: string[];
  serialNo: number;
  interactionId: string;
}

interface IText {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  serialNo: number;
  interactionId: string;
}

interface IWord {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  serialNo: number;
  interactionId: string;
}

interface IQuestion {
  id: string;
  title: string;
  options?: string[];
}

const Edit: React.FC<EditProps> = ({ id }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [selctedQuestionType, setSelectedQuestionType] = useState<Type>(
    Type.None
  );
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(
    null
  );
  const [mcqs, setMcqs] = useState<IMcq[]>([]);
  const [words, setWords] = useState<IWord[]>([]);
  const [text, setText] = useState<IText[]>([]);
  const [fetch, setFetch] = useState<boolean>(true);

  const addMcq = api.interaction.addMcq.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const addWord = api.interaction.addWordCloud.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const addText = api.interaction.addOpenTextQuestion.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const getQuestions = api.interaction.getAllQuestions.useMutation({
    onSuccess: (data) => {
      console.log(data.response);
      if (data.response) {
        setMcqs(data.response.mcq);
        setText(data.response.text);
        setWords(data.response.word);
      }
    },
  });

  useEffect(() => {
    getQuestions.mutateAsync({
      id,
    }).catch(err => console.log(err));
  }, [fetch]);

  useEffect(() => {
    console.log(selctedQuestionType, selectedQuestion);
  }, [selctedQuestionType, selectedQuestion]);

  const getSelectedComponent = () => {
    if (selctedQuestionType === Type.MCQ && selectedQuestion) {
      console.log("came here", selectedQuestion.title);
      return (
        <Mcq
          title={selectedQuestion.title}
          id={selectedQuestion.id}
          options={selectedQuestion.options}
        />
      );
    } else if (selctedQuestionType === Type.WordCloud) {
      return <WordCloud />;
    } else if (selctedQuestionType === Type.Text) {
      return <TextQuestion />;
    } else {
      return <div></div>;
    }
  };

  const handleAddQuestion = (type: string) => {
    setFetch((prev) => !prev);

    if (type === "Mcq") {
      addMcq.mutateAsync({
        title: "What would you like to ask",
        options: [""],
        serialNo: 0,
        interactionId: id,
      }).catch(err => console.log(err));
    }

    if (type === "Word") {
      addWord.mutateAsync({
        title: "What would you like to ask",
        serialNo: 0,
        interactionId: id,
      }).catch(err => console.log(err));
    }

    if (type === "Text") {
      addText.mutateAsync({
        title: "What would you like to ask",
        serialNo: 0,
        interactionId: id,
      }).catch(err => console.log(err));
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { sendRoomJoinEvent } = useSocket();

  useEffect(() => {
    if (sendRoomJoinEvent) {
      console.log(id);
      sendRoomJoinEvent({ id });
    }
  }, [id, sendRoomJoinEvent]);

  if (!isMounted) return null;

  return (
    <div className="h-[100vh] bg-[#1A1A1A]">
      <div>
        <Navbar />
      </div>
      <div className="mt-8 flex items-center justify-evenly">
        <div className="h-[80vh] w-[20vw] rounded-md bg-[#242526]">
          <div className="m-4 flex justify-between">
            <p className="text-2xl text-orange-500">Polls</p>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="rounded-md bg-orange-500 px-7 py-1 text-white hover:bg-orange-600">
                  Add
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border border-orange-400 bg-[#1A1A1A] text-white">
                <DropdownMenuLabel>Select</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-orange-500" />
                <DropdownMenuItem onClick={() => handleAddQuestion("Mcq")}>
                  Mcq
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddQuestion("Word")}>
                  Word Cloud
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddQuestion("Text")}>
                  Text
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mx-auto mt-16 w-[80%] max-h-[calc(80vh-120px)] overflow-y-auto">
            {mcqs.map((mcq) => (
              <div key={mcq.id}>
                <Card
                  title={mcq.title}
                  votes={2}
                  type={Type.MCQ}
                  id={mcq.id}
                  setSelectedQuestion={setSelectedQuestion}
                  setSelectedQuestionType={setSelectedQuestionType}
                  options={mcq.options}
                />
              </div>
            ))}
            {words.map((mcq) => (
              <div key={mcq.id}>
                <Card
                  title={mcq.title}
                  votes={2}
                  type={Type.MCQ}
                  id={mcq.id}
                  setSelectedQuestion={setSelectedQuestion}
                  setSelectedQuestionType={setSelectedQuestionType}
                />
              </div>
            ))}
            {text.map((mcq) => (
              <div key={mcq.id}>
                <Card
                  title={mcq.title}
                  votes={2}
                  type={Type.MCQ}
                  id={mcq.id}
                  setSelectedQuestion={setSelectedQuestion}
                  setSelectedQuestionType={setSelectedQuestionType}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="h-[75vh] w-[70vw] border border-[#27272A]">
          {selctedQuestionType === Type.MCQ && selectedQuestion ? (
            <>
              {console.log("came here", selectedQuestion.title)}
              <Mcq
                title={selectedQuestion.title}
                id={selectedQuestion.id}
                options={selectedQuestion.options}
              />
            </>
          ) : selctedQuestionType === Type.WordCloud ? (
            <WordCloud />
          ) : selctedQuestionType === Type.Text ? (
            <TextQuestion />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<ICard> = (props) => {
  const {
    title,
    votes,
    type,
    id,
    setSelectedQuestion,
    setSelectedQuestionType,
    options = [],
  } = props;

  const getTypeImage = () => {
    if (type === Type.MCQ) return "/test.png";
    else if (type === Type.WordCloud) return "/scrabble.png";
    else if (type === Type.Text) return "/text.png";
    else return "";
  };

  return (
    <div
      onClick={() => {
        setSelectedQuestion({
          title,
          id: id,
          options,
        });
        setSelectedQuestionType(type);
      }}
      className="my-4 cursor-pointer rounded-md border border-orange-500 py-2 text-white"
    >
      <p className="my-3 text-center">{title}?</p>
      <div className="ml-4 flex ">
        <Image src={getTypeImage()} alt={title} height={30} width={30} />
        <div className="ml-2">{votes} votes</div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  return {
    props: {
      id: query.id,
    },
  };
};

export default Edit;
