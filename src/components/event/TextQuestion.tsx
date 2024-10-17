import React from "react";
import { Input } from "../ui/input";
import { api } from "@/utils/api";

export const TextQuestion: React.FC = () => {
  const updateTitle = api.interaction.updateQuestionTitle.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return (
    <div className="text-white">
      <div className="mx-auto mt-8 w-[80%]">
        <Input placeholder="What would you like to ask?" className="h-[5vh]" />
      </div>
    </div>
  );
};
