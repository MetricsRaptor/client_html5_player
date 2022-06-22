import { BrowserCore, BrowserCoreConfig } from "@metricsraptor/browser-core"
export class Player {

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

    public setup() {
    }

    public cleanUp() {
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

export class HTML5Player {

    core: BrowserCore;
    element: HTMLVideoElement;

    constructor(videoElement: HTMLVideoElement, config: BrowserCoreConfig) {
        this.core = new BrowserCore(config);
        this.element = videoElement;
        this.setup();
    }

    async setup() {
        await this.core.validateKey();
        this.element.addEventListener("playing", this.playingEvent)
        this.element.addEventListener("play", this.resumeEvent)
        this.element.addEventListener("pause", this.pauseEvent)
        this.element.addEventListener("seeked", this.seekedEvent)
        this.element.addEventListener("ended", this.endedEvent)
    }

    // Playback is ready to start after having been paused or delayed due to lack of data.
    private playingEvent = (event: Event) => {
        this.core.registerMoment({
            momentType: "player_play"
        })
    }

    // 	Playback has begun.
    private resumeEvent = (event: Event) => {
        this.core.registerMoment({
            momentType: "player_resume"
        })
    }

    // Playback has been paused.
    private pauseEvent = (event: Event) => {
        this.core.registerMoment({
            momentType: "player_pause"
        })
    }

    // 	A seek operation completed.
    private seekedEvent = (event: Event) => {
        this.core.registerMoment({
            momentType: "player_seeked"
        })
    }

    // Playback has stopped because the end of the media was reached.
    private endedEvent = (event: Event) => {
        this.core.registerMoment({
            momentType: "player_ended"
        })
    }

}