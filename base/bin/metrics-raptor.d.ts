export declare class MetricsRaptorTracker {
    socket: any;
    element: HTMLVideoElement;
    session_id: string | null;
    events: string[];
    options: any;
    prevStateAtPing: "paused" | "playing" | "ended" | "";
    constructor(element: HTMLVideoElement, options: object);
    setup(): this;
    cleanUp(): this;
    emitEvent: (event?: Event) => this;
}
export declare const trackVideo: (element?: HTMLVideoElement, options?: object) => MetricsRaptorTracker;
