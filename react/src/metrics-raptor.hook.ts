import { RefObject, useEffect } from "react"
import { trackVideo } from "metricsraptor";

export const useMetricsRaptor = (videoRef: RefObject<HTMLVideoElement>, options: object) => {

    useEffect(() => {
        if (!videoRef.current) return;
        const tracker = trackVideo(videoRef.current, options);
        return () => {
            tracker.cleanUp();
        }
    }, [])
}