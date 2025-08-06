import React, { useEffect } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/router";

export const Navbar: React.FC = () => {
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check if the session is loading or if there's no user data
    if (status === "loading") return;
    if (!data || !data.user) {
      router.push('/').catch(err => console.log(err));
    }
  }, [data, status, router]);

  return (
    <div className="flex h-[7.5vh] items-center justify-between bg-[rgb(36,37,38)]">
      <div className="flex items-center">
        <Image
          src={"/android-chrome-192x192.png"}
          className=" ml-4 rounded-full"
          alt="logo"
          width={50}
          height={50}
        />
        <p className="ml-1 text-4xl text-orange-400">skly</p>
      </div>
      <div>
        {data && (
          <Popover>
            <PopoverTrigger>
              <Image
                src={data.user.image ?? data.user.id}
                alt="user"
                width={40}
                height={40}
                className="mr-4 rounded-full"
              />
            </PopoverTrigger>
            <PopoverContent className="m-2 px-4 py-2 rounded-md bg-[#09090B]">
              <div className="">
                <div>
                  <p className="text-xl text-white ml-2" >{data.user.name}</p>
                </div>
                <div className="flex m-2 cursor-pointer" onClick={() => signOut().catch(err => console.log(err))} >
                  <Image
                    src={"/logout.png"}
                    alt="logout"
                    width={40}
                    height={20}
                  />
                  <p className="ml-2 py-2 text-red-500">Log Out</p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};
