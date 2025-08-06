import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { api } from "@/utils/api";
import { useSocket } from "@/context/SocketProvider";
import { useRouter } from "next/router";

interface IQuestion {
  title: string;
  options?: string[];
  id: string;
}

interface IOption {
  options: string[] | undefined;
  id: string;
}

export const Mcq: React.FC<IQuestion> = (props) => {
  const { title, options, id } = props;
  const { startInteraction } = useSocket();

  const router = useRouter();

  const updateTitle = api.interaction.updateQuestionTitle.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const [newTitle, setTitle] = useState<string>(title);
  const [answerLink, setAnswerLink] = useState<string | null>(null);

  useEffect(() => {
    setTitle(title);
  }, [title]);

  const handleUpdateTitle = () => {
    updateTitle.mutateAsync({
      id: id,
      title: newTitle,
      type: "Mcq",
    }).catch(err => console.log(err));
  };

  return (
    <div className="text-white">
      <div className="mx-auto mt-8 flex w-[85%]">
        <Input
          placeholder={newTitle}
          className="h-[5vh]"
          onChange={(e) => setTitle(e.target.value)}
          value={newTitle}
        />
        <div>
          <button
            onClick={handleUpdateTitle}
            className="ml-2 rounded-md bg-orange-500 px-7 py-3 text-white hover:bg-orange-600"
          >
            Save
          </button>
        </div>
      </div>
      <div className="mx-auto mt-8 h-[50vh] w-[90%]">
        <Option id={id} options={options} />
      </div>
      <div className="mx-auto flex w-[80%] items-center justify-evenly rounded-md border border-orange-400 bg-[#242526] py-2">
        <div>
          <button
            onClick={() => {
              const rid = router.query.id;
              console.log("rid", rid);
              if (rid && typeof rid === "string") {
                startInteraction({
                  id,
                  rid,
                  title: newTitle,
                  options: options ?? [],
                });
                setAnswerLink(`http://localhost:3000/user/answer?id=${rid}`);
              }
            }}
            className="rounded-md bg-orange-500 px-7 py-3 text-white hover:bg-orange-600"
          >
            Start Interaction
          </button>
        </div>
        {answerLink && (
          <p className="mt-3 text-center text-orange-400">
            Share this link with participants:&nbsp;
            <a href={answerLink} target="_blank" rel="noreferrer" className="underline">
              {answerLink}
            </a>
          </p>
        )}
        <div className="text-white">Start an interaction to collect votes</div>
        <div className="text-xl font-bold text-orange-400">askly</div>
      </div>
    </div >
  );
};

const Option: React.FC<IOption> = ({ options = [], id }) => {
  const [optionList, setOptionList] = useState<string[]>(options);

  const updateOptionList = api.interaction.addOptions.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  useEffect(() => {
    setOptionList(options);
  }, [options]);

  // Handle adding new option input field
  const handleAddOption = () => {
    setOptionList([...optionList, ""]);
  };

  // Handle option input change
  const handleInputChange = (index: number, value: string) => {
    const updatedOptions = [...optionList];
    updatedOptions[index] = value;
    setOptionList(updatedOptions);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = optionList.filter((_, i) => i !== index);
    setOptionList(updatedOptions);
  };

  const saveOption = () => {
    updateOptionList.mutateAsync({
      id,
      options: optionList,
    }).catch(err => console.log(err));
  };

  return (
    <div>
      {optionList.length > 0 ? (
        <div>
          {optionList.map((option, id) => (
            <div key={id} className="mb-2 flex items-center">
              <Input
                placeholder="Option"
                value={option}
                className="mx-auto w-[80%] border border-orange-300"
                onChange={(e) => handleInputChange(id, e.target.value)}
              />
              <button
                onClick={() => handleRemoveOption(id)}
                className="rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className=" mx-auto w-[80%] rounded-sm">
          {/* <Input placeholder="Option" className="border border-orange-300" /> */}
        </div>
      )}
      <div>
        <button
          onClick={handleAddOption}
          className="mx-auto mt-4 flex rounded-md bg-orange-500 px-7 py-1 text-white hover:bg-orange-600"
        >
          Add Option
        </button>
        <button
          onClick={saveOption}
          className="mx-auto mt-4 flex rounded-md bg-orange-500 px-7 py-1 text-white hover:bg-orange-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};
