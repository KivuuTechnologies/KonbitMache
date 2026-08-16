export function logError(message: string, ...args: unknown[]) {
  console.error(`[error] ${message}`, ...args);
}

export function logWarn(message: string, ...args: unknown[]) {
  console.warn(`[warn] ${message}`, ...args);
}

export function logInfo(message: string, ...args: unknown[]) {
  console.log(`[info] ${message}`, ...args);
}
