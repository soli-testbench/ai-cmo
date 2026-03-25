type LogLevel = "debug" | "info" | "warn" | "error";

const LEVELS: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}

function getMinLevel(): LogLevel {
  const level = process.env.LOG_LEVEL as LogLevel | undefined;
  if (level && level in LEVELS) {
    return level;
  }
  return "info";
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function formatJson(level: LogLevel, message: string, context: Record<string, unknown>): string {
  return JSON.stringify({ level, message, timestamp: new Date().toISOString(), ...context });
}

function formatPretty(level: LogLevel, message: string, context: Record<string, unknown>): string {
  const timestamp = new Date().toISOString();
  const tag = level.toUpperCase().padEnd(5);
  const ctxStr = Object.keys(context).length > 0 ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] ${tag}: ${message}${ctxStr}`;
}

export function createLogger(name?: string): Logger {
  const baseContext: Record<string, unknown> = name ? { logger: name } : {};

  function log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const minLevel = getMinLevel();
    if (LEVELS[level] < LEVELS[minLevel]) {
      return;
    }

    const mergedContext = { ...baseContext, ...context };
    const output = isProduction()
      ? formatJson(level, message, mergedContext)
      : formatPretty(level, message, mergedContext);

    switch (level) {
      case "error":
        console.error(output);
        break;
      case "warn":
        console.warn(output);
        break;
      default:
        console.log(output);
        break;
    }
  }

  return {
    debug: (message, context) => log("debug", message, context),
    info: (message, context) => log("info", message, context),
    warn: (message, context) => log("warn", message, context),
    error: (message, context) => log("error", message, context),
  };
}

export const logger = createLogger();
