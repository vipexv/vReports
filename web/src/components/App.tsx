import React, { useEffect, useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { debugData } from "../utils/debugData";
import { fetchNui } from "../utils/fetchNui";
import { isEnvBrowser } from "../utils/misc";
import { Separator } from "@/components/ui/separator";
import "./App.css";
import { MessageSquareWarning, ShieldAlert } from "lucide-react";

debugData([
  {
    action: "setVisible",
    data: true,
  },
]);

const App: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useNuiEvent<boolean>("setVisible", setVisible);

  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (["Backspace", "Escape"].includes(e.code)) {
        if (!isEnvBrowser()) fetchNui("hideFrame");
        else setVisible(!visible);
      }
    };

    window.addEventListener("keydown", keyHandler);

    return () => window.removeEventListener("keydown", keyHandler);
  }, [visible]);

  return (
    <>
      <div className="flex w-[100dvw] h-[100dvh] justify-center items-center">
        <div className="min-w-[45dvw] min-h-[35dvw] bg-primary">
          <div className="flex items-center">
            <h1 className="m-2 relative flex justify-center items-center p-1 bg-secondary` bg-opacity-50 font-main text-white text-xl border">
              <ShieldAlert size={18} className="mr-1 text-red-500" />
              Report Menu
            </h1>
          </div>
          <Separator />
        </div>
      </div>
    </>
  );
};

export default App;
