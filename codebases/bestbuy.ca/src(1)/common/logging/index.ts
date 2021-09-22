export enum Level {
    Info,
    Warn,
    Error,
}

export interface Logger {
    level: Level;
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (error: Error | string) => void;
    trace: (message: string) => void;
}
