import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./Routes";

import autoREM from "@/utils/autoRem";

export function AppProviders() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cleanup = autoREM(1536, 16);

    // триггерим появление после маунта
    queueMicrotask(() => {
      setVisible(true);
    })

    return cleanup;
  }, []);

  return (
    <BrowserRouter basename="/games/taggame">
      <div className={`app ${visible ? "app--visible" : ""}`}>
        <AppRouter />
      </div>
    </BrowserRouter>
  );
}
export default AppProviders;
