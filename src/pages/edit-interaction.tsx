import React, { useState } from "react";
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

interface EditProps {
  id: string;
}

interface ICard {
  title: string;
  votes: number;
  type: Type;
} 

enum Type {
  MCQ,
  WordCloud,
  Text,
  None,
}

const Edit: React.FC<EditProps> = ({ id }) => {
  const [selctedQuestion, setSelectedQuestion] = useState<Type>(Type.None);

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

  const getSelectedComponent = () => {
    if (selctedQuestion === Type.MCQ) {
      return <Mcq />;
    } else if (selctedQuestion === Type.WordCloud) {
      return <WordCloud />;
    } else if (selctedQuestion === Type.Text) {
      return <TextQuestion />;
    } else {
      return <div></div>;
    }
  };

  const handleAddQuestion = (type: string) => {
    if (type === "Mcq") {
      setSelectedQuestion(Type.MCQ);
      addMcq.mutateAsync({
        title: 'What would you like to ask',
        options: [''],
        serialNo: 0,
        interactionId: id
      })
    }

    if (type === "Word") {
      setSelectedQuestion(Type.WordCloud);
      addWord.mutateAsync({
        title: 'What would you like to ask',
        serialNo: 0,
        interactionId: id
      })
    }

    if (type === "Text") {
      setSelectedQuestion(Type.Text);
      addText.mutateAsync({
        title: 'What would you like to ask',
        serialNo: 0,
        interactionId: id
      })
    }
  };

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
          <div className="mx-auto mt-16 w-[80%] overflow-y-auto">
            <div>
              <Card title="What is this question" votes={2} type={Type.MCQ} />
            </div>
            <div>
              <Card
                title="What is this question"
                votes={2}
                type={Type.WordCloud}
              />
            </div>
            <div>
              <Card title="What is this question" votes={2} type={Type.Text} />
            </div>
          </div>
        </div>
        <div className="h-[75vh] w-[70vw] border border-[#27272A]">
          {getSelectedComponent()}
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<ICard> = (props) => {
  const { title, votes, type } = props;

  const getTypeImage = () => {
    if (type === Type.MCQ) return "/test.png";
    else if (type === Type.WordCloud) return "/scrabble.png";
    else if (type === Type.Text) return "/text.png";
    else return "";
  };

  return (
    <div className="my-4 rounded-md border border-orange-500 py-2 text-white">
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
