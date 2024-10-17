import React, { useCallback, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { api } from "@/utils/api";

interface IQuestion {
  title: string;
  options?: string[];
  id: string;
}

export const Mcq: React.FC<IQuestion> = (props) => {
  const { title, options, id } = props;

  const updateTitle = api.interaction.updateQuestionTitle.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const [newTitle, setTitle] = useState<string>(title);

  const handleUpdateTitle = () => {
    updateTitle.mutateAsync({
        id: id,
        title: newTitle,
        type: 'Mcq'
    })
  }

  return (
    <div className="text-white">
      <div className="mx-auto mt-8 w-[85%] flex">
        <Input
          placeholder={title}
          className="h-[5vh]"
          onChange={(e) => setTitle(e.target.value)}
          value={newTitle}
        />
        <div>
        <button onClick={handleUpdateTitle} className="ml-2 rounded-md bg-orange-500 px-7 py-3 text-white hover:bg-orange-600">
            Save
          </button>
        </div>
      </div>
      <div className="mx-auto mt-8 h-[50vh] w-[90%]"></div>
      <div className="mx-auto flex w-[80%] items-center justify-evenly rounded-md border border-orange-400 bg-[#242526] py-2">
        <div>
          <button className="rounded-md bg-orange-500 px-7 py-3 text-white hover:bg-orange-600">
            Start Interaction
          </button>
        </div>
        <div className="text-white">Start an interaction to collect votes</div>
        <div className="text-xl font-bold text-orange-400">askly</div>
      </div>
    </div>
  );
};
