import { Routes, Route } from "react-router";
import { Theme } from "@radix-ui/themes";
import { useAtomValue } from "jotai";
import { themeAtom } from "@/store/atoms";
import { HomePage } from "@/pages/Home";

export function App() {
  const theme = useAtomValue(themeAtom);

  return (
    <div className={`theme-${theme}`}>
      <Theme appearance={theme} accentColor="amber" grayColor="sand" radius="medium" scaling="100%">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Theme>
    </div>
  );
}
