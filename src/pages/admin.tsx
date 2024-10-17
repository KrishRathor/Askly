import { InteractionCard } from "@/components/Interaction";
import { Navbar } from "../components/Navbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Admin: React.FC = () => {
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
                {/* <DialogHeader>
                  <DialogTitle className="text-2xl text-white">
                    Create a new Interaction
                  </DialogTitle>
                  <CreateInteractionForm />
                </DialogHeader> */}
                <CreateInteractionForm />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col items-center">
          <InteractionCard title="Slido1" />
          <InteractionCard title="Slido1" />
          <InteractionCard title="Slido1" />
        </div>
      </div>
    </div>
  );
};

export const CreateInteractionForm = () => {
  return (
    <div className="">
      <div className="mb-8">
        <Label htmlFor="title" className="block text-lg font-semibold text-white">
          Enter title for your interaction
        </Label>
        <Input
          id="title"
          placeholder="Type your title here..."
          className="mt-4 w-full text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div className="flex justify-center mt-6">
        <Button variant="outline" className="text-white bg-orange-400 hover:bg-orange-400 hover:text-gray-900">
          Create
        </Button>
      </div>
    </div>
  );
};

export default Admin;
