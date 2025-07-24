import { LRUCache } from "lru-cache";

declare global {
  var cache: LRUCache<string, any>;
}

globalThis.cache =
  globalThis.cache ||
  new LRUCache<string, any>({
    max: 300,
    ttl: process.env.NODE_ENV === "production" ? 1000000 : 1,
  });

export async function fetchCached<T>(opts: {
  fn: () => Promise<T>;
  key: string;
  ttl: number;
}): Promise<T> {
  if (cache.has(opts.key)) {
    return cache.get(opts.key) as T;
  }

  const result = await opts.fn();

  cache.set(opts.key, result, {
    ttl: opts.ttl,
  });

  return result;
}
