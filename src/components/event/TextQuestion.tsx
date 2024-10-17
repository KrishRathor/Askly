import React from "react";
import { Input } from "../ui/input";

export const TextQuestion: React.FC = () => {
  return (
    <div className="text-white" >
      <div className="mx-auto mt-8 w-[80%]">
        <Input 
            placeholder="What would you like to ask?"
            className="h-[5vh]"
        />
      </div>
    </div>
  );
};
