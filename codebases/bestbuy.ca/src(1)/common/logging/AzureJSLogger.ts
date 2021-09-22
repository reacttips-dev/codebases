import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { AzureConfig } from "../../config";
import { Level, Logger } from "../logging/";

export default class AzureJSLogger implements Logger {
    private azureLogLevel;
    private appInsights;
    constructor(public level: Level, azureConfig: AzureConfig, private logger?: Logger) {

        this.appInsights = new ApplicationInsights({
            config: {
                instrumentationKey: azureConfig.instrumentationKey,
            },
        });
        this.appInsights.loadAppInsights();
        this.appInsights.config.samplingPercentage = azureConfig.samplingPercentage || 100;
        this.appInsights.config.disableTelemetry = azureConfig.disableTelemetry || false;

        if (this.level === Level.Error) {
            this.azureLogLevel = 3; // error
        } else if (this.level === Level.Warn) {
            this.azureLogLevel = 2; // warn
        } else {
            this.azureLogLevel = 1; // info
        }
    }

    public info(message: string) {
        if (this.logger) {
            this.logger.info(message);
        }

        if (this.level <= Level.Info) {
            this.log("info", message);
        }
    }

    public warn(message: string) {
        if (this.logger) {
            this.logger.warn(message);
        }

        if (this.level <= Level.Warn) {
            this.log("warn", message);
        }
    }

    public error(error: Error | string) {
        if (this.logger) {
            this.logger.error(error);
        }

        if (this.level <= Level.Error) {
            this.log("error", error);
        }
    }

    public trace(message: any) {
        // don't send traces from browser for now
        // if we do should only send for info level
    }

    public trackPageView() {
        this.appInsights.trackPageView();
    }

    private log(tag: string, message: any) {

        if (message instanceof Error) {
            this.appInsights.trackException({exception: message});
        }

        this.appInsights.trackEvent({
            name: `[${tag}] ${message}`,
            properties: {
                customProperty: this.azureLogLevel,
            },
        });
    }
}
