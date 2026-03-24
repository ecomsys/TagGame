import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./Routes";

import autoREM from "@/utils/autoRem";

export function AppProviders() {
  useEffect(() => {
    const cleanup = autoREM(1536, 16);

    return cleanup;
  }, []);

  return (
    <BrowserRouter>   
     <AppRouter />
    </BrowserRouter>
  );
}
export default AppProviders;
