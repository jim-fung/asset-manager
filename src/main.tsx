import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider as JotaiProvider } from "jotai";
import { App } from "@/App";
import "@/index.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <StrictMode>
      <JotaiProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </JotaiProvider>
    </StrictMode>
  </ErrorBoundary>,
);
