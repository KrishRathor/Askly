import { Navbar } from "@/components/Navbar";
import { useSocket } from "@/context/SocketProvider";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface AnswerProps {
  id: string;
}

const Answer: React.FC<AnswerProps> = ({ id }) => {
  const { sendRoomJoinEvent, question, sendMcqAnswer, votes } = useSocket();
  const [title, setTitle] = useState<string>();
  const [options, setOptions] = useState<string[] | undefined>([]);
  const [questionId, setQuestionId] = useState<string>();
  const [votesState, setVotes] = useState<any>(votes);

  useEffect(() => {
    if (sendRoomJoinEvent) {
      console.log(id);
      sendRoomJoinEvent({ id });
    }
  }, [id, sendRoomJoinEvent]);

  useEffect(() => {
    setTitle(question?.title);
    setOptions(question?.options);
    setQuestionId(question?.id);
  }, [question]);

  useEffect(() => {
    setVotes(votes);
    console.log(votes);
  }, [votes]);

  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSendClick = () => {
    console.log(selectedOption, questionId);
    if (!questionId) return;
    sendMcqAnswer({
      rid: id,
      questionId: questionId,
      option: selectedOption,
    });
  };

  return (
    <div className="h-[100vh] bg-[#1A1A1A]">
      <div>
        <Navbar />
      </div>
      <div className="text-white">
        <div className="mt-4 text-center text-3xl text-orange-300">
          {" "}
          {title}{" "}
        </div>
        <div>
          {options?.map((option, id) => {
            const totalVotes = Object.values(votes || {}).reduce(
              //@ts-ignore
              (sum, count) => sum + count,
              0
            );
            const optionVotes = votes?.[option] || 0;
            //@ts-ignore
            const percentage = totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0; 

            return (
              <div
                className={`mx-auto my-4 w-[40%] cursor-pointer rounded-md border py-3 text-center ${
                  selectedOption === option
                    ? "border-orange-400"
                    : "border-white"
                }`}
                key={id}
                onClick={() => setSelectedOption(option)}
              >
                {option} - {optionVotes} votes ({percentage.toFixed(2)}%)
              </div>
            );
          })}
          <div>
            <button
              className="mx-auto flex rounded-md bg-orange-500 px-7 py-1 text-white hover:bg-orange-600"
              onClick={handleSendClick}
            >
              Send
            </button>
          </div>
        </div>
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

export default Answer;
