import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

export const Navbar: React.FC = () => {
  const { data } = useSession();

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
          <Image
            src={data.user.image ?? data.user.id}
            alt="user"
            width={40}
            height={40}
            className="rounded-full mr-4"
          />
        )}
      </div>
    </div>
  );
};
