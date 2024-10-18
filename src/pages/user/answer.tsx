import { Navbar } from "@/components/Navbar";
import { GetServerSideProps } from "next";
import React from "react";

interface AnswerProps {
  id: string;
}

const Answer: React.FC<AnswerProps> = ({ id }) => {
  return (
    <div className="h-[100vh] bg-[#1A1A1A]">
      <div>
        <Navbar />
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
