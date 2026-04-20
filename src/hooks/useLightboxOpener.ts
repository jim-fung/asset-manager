import { useSetAtom } from "jotai";
import { lightboxTriggerIdAtom } from "@/store/atoms";

export function useLightboxOpener(setRouteState: (update: { imageId: string | null }) => void) {
  const setLightboxTriggerId = useSetAtom(lightboxTriggerIdAtom);

  return (imageId: string, triggerId: string) => {
    setLightboxTriggerId(triggerId);
    setRouteState({ imageId });
  };
}
