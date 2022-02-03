"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackVideo = exports.MetricsRaptorTracker = void 0;
const socket_io_client_1 = require("socket.io-client");
class MetricsRaptorTracker {
    constructor(element, options) {
        this.session_id = null;
        this.events = ["pause", "ended", "playing"];
        this.prevStateAtPing = "";
        this.emitEvent = (event) => {
            if (!this.socket)
                return;
            const d = event ? event.target : this.element;
            if (d.paused && this.prevStateAtPing === "paused")
                return;
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
                        type: (event === null || event === void 0 ? void 0 : event.type) || "ping",
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
            });
            this.prevStateAtPing = d.paused ? "paused" : d.ended ? "ended" : "playing";
            return this;
        };
        this.element = element;
        this.options = options;
        this.setup();
    }
    setup() {
        if (!this.element)
            return;
        this.events.forEach(event => {
            this.element.addEventListener(event, this.emitEvent);
        });
        this.socket = (0, socket_io_client_1.io)(`wss://metricsraptor-evobk.ondigitalocean.app`, { path: "/rooms/ws", transports: ["websocket"] });
        setInterval(() => {
            this.emitEvent();
        }, 1000);
        return this;
    }
    cleanUp() {
        var _a;
        if (!this.element)
            return;
        this.events.forEach(event => {
            this.element.removeEventListener(event, this.emitEvent);
        });
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.disconnect();
        return this;
    }
}
exports.MetricsRaptorTracker = MetricsRaptorTracker;
const trackVideo = (element, options) => {
    if (!element || !options)
        return null;
    return new MetricsRaptorTracker(element, options);
};
exports.trackVideo = trackVideo;
//# sourceMappingURL=metrics-raptor.js.map