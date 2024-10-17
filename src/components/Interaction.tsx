import React from "react";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface InteractionCardProps {
  title: string;
}

export const InteractionCard: React.FC<InteractionCardProps> = (props) => {
  const { title } = props;

  return (
    <div className="flex w-[60vw] items-center justify-between bg-[#242526] py-4 rounded-md m-4">
      <div className="ml-4 flex">
        <Image src="/communication.png" alt="logo" width={30} height={30} />
        <p className="ml-2 text-xl text-white" >{title}</p>
      </div>
      <div className="mr-4" >
        <Popover>
            <PopoverTrigger>
            <Image src="/app.png" alt="logo" width={30} height={30} />
            </PopoverTrigger>
            <PopoverContent className="w-fit" >
                <div>
                    <p className="text-green-600 text-xl cursor-pointer" >Open</p>
                    <p className="text-red-600 text-xl cursor-pointer " >Delete</p>
                </div>
            </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
