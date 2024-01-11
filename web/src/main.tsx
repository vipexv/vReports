import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { Toaster } from "@/components/ui/sonner";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <App />
      <Toaster />
    </MantineProvider>
  </React.StrictMode>
);
