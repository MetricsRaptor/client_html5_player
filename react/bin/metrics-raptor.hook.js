"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMetricsRaptor = void 0;
const react_1 = require("react");
const metricsraptor_1 = require("metricsraptor");
const useMetricsRaptor = (videoRef, options) => {
    (0, react_1.useEffect)(() => {
        if (!videoRef.current)
            return;
        const tracker = (0, metricsraptor_1.trackVideo)(videoRef.current, options);
        return () => {
            tracker.cleanUp();
        };
    }, []);
};
exports.useMetricsRaptor = useMetricsRaptor;
//# sourceMappingURL=metrics-raptor.hook.js.map