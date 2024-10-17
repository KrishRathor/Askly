import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const Home: NextPage = () => {

  const router = useRouter();

  return (
    <div className="text-center">
      a beautiful landing page coming soon
      <br />
      <div className="flex justify-center">
        <button
          className="m-2 rounded-md bg-blue-800 px-8 py-2 text-center text-white hover:bg-blue-900"
          onClick={() => signIn()}
        >
          Sign In
        </button>
        <button
          className="m-2 rounded-md bg-green-800 px-8 py-2 text-center text-white hover:bg-green-900"
          onClick={() => router.push('/admin')}
        >
          Go To App
        </button>
      </div>
    </div>
  );
};

export default Home;
