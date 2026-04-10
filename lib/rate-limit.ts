type RateLimitEntry = number[];

const ipRequests = new Map<string, RateLimitEntry>();

type RateLimitOptions = {
    limit: number;
    windowMs: number;
};

export function isRateLimited(ip: string, options: RateLimitOptions): boolean {
    const { limit, windowMs } = options;
    const now = Date.now();
    const windowStart = now - windowMs;

    const current = ipRequests.get(ip) ?? [];
    const recent = current.filter((ts) => ts > windowStart);

    recent.push(now);
    ipRequests.set(ip, recent);

    return recent.length > limit;
}