export function queueTask(callback: () => void) {
    setTimeout(callback);
}

export function now() {
    return 'performance' in self && self.performance.now && self.performance.now();
}
