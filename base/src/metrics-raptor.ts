import { io } from "socket.io-client";

export class MetricsRaptorTracker {

    socket: any;
    element: HTMLVideoElement;
    session_id: string | null = null;
    events = ["pause", "ended", "playing"];
    options: any;
    prevStateAtPing: "paused" | "playing" | "ended" | "" = "";

    constructor(element: HTMLVideoElement, options: object) {
        this.element = element;
        this.options = options;
        this.setup();
    }

    setup() {
        if (!this.element) return;
        this.events.forEach(event => {
            this.element.addEventListener(event, this.emitEvent)
        });
        this.socket = io(`wss://metricsraptor-evobk.ondigitalocean.app`, { path: "/rooms/ws", transports: ["websocket"] });
        setInterval(() => {
            // Ping current state :)
            this.emitEvent();
        }, 1000);
        return this;
    }

    cleanUp() {
        if (!this.element) return;
        this.events.forEach(event => {
            this.element.removeEventListener(event, this.emitEvent)
        });
        this.socket?.disconnect();
        return this;
    }

    emitEvent = (event?: Event) => {
        // send a 5 second valid key with the stat update for verification
        // make the data as an array buffer
        // server side check if playtime checks out and maybe some other data checks
        if (!this.socket) return;
        const d = event ? event.target as HTMLVideoElement : this.element;

        // Don't ping if paused :)
        if (d.paused && this.prevStateAtPing === "paused") return;

        this.socket.emit("message", {
            message: "video.event",
            data: {
                apiKey: this.options.apiKey,
                playerDetails: {
                    autofocus: d.autofocus,
                    autoplay: d.autoplay,
                    clientHeight: d.clientHeight,
                    clientWidth: d.clientWidth,
                    controls: d.controls,
                    defaultMuted: d.defaultMuted,
                    defaultPlaybackRate: d.defaultPlaybackRate,
                    loop: d.loop
                },
                videoDetails: {
                    videoHeight: d.videoHeight,
                    videoWidth: d.videoWidth,
                    src: d.src,
                    title: d.title,
                    poster: d.poster,
                    duration: d.duration,
                    baseURI: d.baseURI,
                },
                interactables: {
                    type: event?.type || "ping",
                    playbackRate: d.playbackRate,
                    seeking: d.seeking,
                    volume: d.volume,
                    paused: d.paused,
                    muted: d.muted,
                    translate: d.translate,
                    currentSrc: d.currentSrc,
                    currentTime: d.currentTime
                },
            }
        })

        this.prevStateAtPing = d.paused ? "paused" : d.ended ? "ended" : "playing";
        return this;
    }
}

export const trackVideo = (element: HTMLVideoElement, options: object) => {
    return new MetricsRaptorTracker(element, options);
}