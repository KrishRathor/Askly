import { type AppType } from "next/app";
import { api } from "../utils/api";

import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { SocketProvider } from "@/context/SocketProvider";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <SocketProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </SocketProvider>
  );
};

export default api.withTRPC(MyApp);
