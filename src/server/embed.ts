import { createServerFn } from "@tanstack/react-start";
import { load } from "cheerio";
import { z } from "zod";
import { fetchCached } from "./cache";

const oneWeek = 1000 * 60 * 60 * 24 * 7;

export const getOpengraphEmbedData = createServerFn({ method: "GET" })
  .validator(z.object({ url: z.string().url() }))
  .handler(async (ctx) => {
    return await fetchCached({
      key: `embed-${ctx.data.url}`,
      ttl: oneWeek,
      fn: async () => {
        const url = URL.parse(ctx.data.url);

        if (!url) {
          throw new Error("Invalid URL");
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`Failed to fetch embed data for ${url}`);
        }

        const text = await response.text();

        const $ = load(text);
        const image = $('meta[property="og:image"]').attr("content") || "";
        const title = $('meta[property="og:title"]').attr("content") || "";
        const description = $('meta[property="og:description"]').attr("content") || "";

        return {
          image,
          title,
          description,
          url: {
            pathname: url.pathname,
            search: url.search,
            hash: url.hash,
            host: url.host,
          },
        };
      },
    });
  });