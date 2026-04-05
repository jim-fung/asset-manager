import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider as JotaiProvider } from "jotai";
import { Theme } from "@radix-ui/themes";
import { App } from "@/App";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <JotaiProvider>
      <BrowserRouter>
        <Theme appearance="dark" accentColor="amber" grayColor="sand" radius="medium" scaling="100%">
          <App />
        </Theme>
      </BrowserRouter>
    </JotaiProvider>
  </StrictMode>,
);
