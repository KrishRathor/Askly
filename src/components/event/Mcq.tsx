import React from "react";
import { Input } from "../ui/input";

export const Mcq: React.FC = () => {
  return (
    <div className="text-white">
      <div className="mx-auto mt-8 w-[80%]">
        <Input placeholder="What would you like to ask?" className="h-[5vh]" />
      </div>
      <div className="mx-auto mt-8 h-[50vh] w-[90%]">

      </div>
      <div className="flex justify-evenly border border-orange-400 items-center py-2 w-[80%] mx-auto rounded-md bg-[#242526]">
        <div>
          <button className="rounded-md bg-orange-500 px-7 py-3 text-white hover:bg-orange-600">
            Start Interaction
          </button>
        </div>
        <div className="text-white" >Start an interaction to collect votes</div>
        <div className="text-xl text-orange-400 font-bold" >askly</div>
      </div>
    </div>
  );
};
