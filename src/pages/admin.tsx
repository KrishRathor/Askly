import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "../components/Navbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { InteractionCard } from "@/components/Interaction";

interface Interaction {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  userId: string;
}

const Admin: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [fetch, setFetch] = useState<boolean>(true);

  const getAllInteractions = api.interaction.getAllInteractions.useMutation({
    onSuccess: (data) => {
      data.response && setInteractions(data.response);
      setLoading(false);
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    getAllInteractions.mutateAsync().catch(err => console.log(err));
  }, [fetch]);

  if (!isMounted) {
    return null; // Ensure it only renders on the client
  }

  return (
    <div className="m-0 h-[100vh] bg-[#1A1A1A] p-0">
      <div>
        <Navbar />
      </div>
      <div>
        <div className="sm:item-center mx-auto mt-8 flex flex-col sm:flex-row sm:justify-evenly">
          <p className="text-center text-3xl text-orange-500">Interactions</p>
          <Dialog>
            <DialogTrigger>
              <button className="mx-auto w-fit rounded-md bg-orange-500 px-6 py-2 text-white hover:bg-orange-600 sm:mx-0">
                <span className="text-white">+</span> Create interaction
              </button>
            </DialogTrigger>
            <DialogContent className="border-orange-500 bg-[#09090B]">
              <DialogHeader>
                <DialogTitle>Create your interaction</DialogTitle>
                <CreateInteractionForm fetchInteractions={setFetch} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col items-center">
          {loading && (
            <div className="mt-8">
              <Skeleton className="mt-4 h-[5vh] w-[60vw] rounded-md bg-[#27272A]" />
              <Skeleton className="mt-4 h-[5vh] w-[60vw] rounded-md bg-[#27272A]" />
              <Skeleton className="mt-4 h-[5vh] w-[60vw] rounded-md bg-[#27272A]" />
            </div>
          )}
          {interactions.map((interaction) => (
            <div key={interaction.id}>
              <InteractionCard fetch={setFetch} id={interaction.id} title={interaction.title} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ICreateInteractionForm {
  fetchInteractions: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateInteractionForm: React.FC<ICreateInteractionForm> = ({
  fetchInteractions,
}) => {
  const [title, setTitle] = useState<string>("");

  const createInteractionMutation =
    api.interaction.createInteraction.useMutation({
      onSuccess: (data) => {
        toast("Created interaction successfully");
        fetchInteractions((prev) => !prev);
      },
    });

  const handleCreateInteraction = () => {
    if (title == "") return;
    createInteractionMutation.mutateAsync({
      title,
    }).catch(err => console.log(err));
    setTitle("");
    toast("Created interaction successfully");
  };

  return (
    <div className="">
      <div className="mb-8">
        <Label className="block text-lg font-semibold text-white">
          Enter title for your interaction
        </Label>
        <Input
          placeholder="Type your title here..."
          className="mt-4 w-full rounded-md border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-orange-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          variant="outline"
          className="bg-orange-400 text-white hover:bg-orange-400 hover:text-gray-900"
          onClick={handleCreateInteraction}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default Admin;
