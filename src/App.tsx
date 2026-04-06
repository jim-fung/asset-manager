import { Routes, Route } from "react-router";
import { Theme } from "@radix-ui/themes";
import { HomePage } from "@/pages/Home";

export function App() {
  return (
    <Theme appearance="light" accentColor="amber" grayColor="sand" radius="medium" scaling="100%">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Theme>
  );
}
