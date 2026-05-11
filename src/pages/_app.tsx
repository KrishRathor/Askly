import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import { SocketProvider } from "@/context/SocketProvider";
import { SessionProvider } from "@/context/SessionProvider";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <SocketProvider>
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </SocketProvider>
  );
};

export default api.withTRPC(MyApp);
