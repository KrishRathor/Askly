import React from "react";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

interface InteractionCardProps {
  title: string;
  fetch: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

export const InteractionCard: React.FC<InteractionCardProps> = (props) => {
  const { title, fetch, id } = props;
  const router = useRouter();

  const deleteInteraction = api.interaction.deleteInteraction.useMutation({
    onSuccess: (data) => {
      console.log(data);
      fetch((prev) => !prev);
    },
  });

  return (
    <div className="m-4 flex w-[60vw] items-center justify-between rounded-md bg-[#242526] py-4">
      <div className="ml-4 flex">
        <Image src="/communication.png" alt="logo" width={30} height={30} />
        <p className="ml-2 text-xl text-white">{title}</p>
      </div>
      <div className="mr-4">
        <Popover>
          <PopoverTrigger>
            <Image src="/app.png" alt="logo" width={30} height={30} />
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <div>
              <p
                className="cursor-pointer text-xl text-green-600"
                onClick={() => {
                  router.push(`/edit-interaction?id=${id}`).catch(err => console.log(err));
                }}
              >
                Open
              </p>
              <p
                className="cursor-pointer text-xl text-red-600"
                onClick={() => {
                  deleteInteraction.mutateAsync({
                    id,
                  }).catch(err => console.log(err))
                }}
              >
                Delete
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
