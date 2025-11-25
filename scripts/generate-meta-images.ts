#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import sharp from "sharp";

// Image dimensions for social sharing (Twitter/OpenGraph)
const WIDTH = 1200;
const HEIGHT = 630;

// Colors and styling
const BACKGROUND_COLOR = "#f8f8f8";
const PRIMARY_TEXT_COLOR = "#000000";
const SECONDARY_TEXT_COLOR = "#666666";
const BRAND_COLOR = "#000000";

interface PostData {
  title: string;
  date: string;
}

async function loadFont(
  fontPath: string,
  weight: 400 | 700,
): Promise<{
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
}> {
  const data = await fs.promises.readFile(fontPath);
  return {
    name: "Inter",
    data: data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength),
    weight,
    style: "normal",
  };
}

export async function generateMetaImage(post: PostData): Promise<Buffer> {
  // Load fonts
  const fonts = await Promise.all([
    loadFont(path.join(process.cwd(), "assets/fonts/Inter-Regular.ttf"), 400),
    loadFont(path.join(process.cwd(), "assets/fonts/Inter-Bold.ttf"), 700),
  ]);

  // Format date
  const date = new Date(post.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Load avatar as base64
  let avatarDataUrl = "";
  try {
    const avatarPath = path.join(
      process.cwd(),
      "public/static/images/photo.png",
    );
    const avatarBuffer = await fs.promises.readFile(avatarPath);
    avatarDataUrl = `data:image/png;base64,${avatarBuffer.toString("base64")}`;
  } catch (_error) {
    // Avatar will be omitted if not found
  }

  // Generate SVG using satori
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: BACKGROUND_COLOR,
          padding: "80px",
          position: "relative",
        },
        children: [
          // Top section with metadata and avatar
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                width: "100%",
              },
              children: [
                // Left side: metadata
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "32px",
                            color: SECONDARY_TEXT_COLOR,
                            fontWeight: 400,
                          },
                          children: "Blog post",
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "32px",
                            color: SECONDARY_TEXT_COLOR,
                            fontWeight: 400,
                          },
                          children: formattedDate,
                        },
                      },
                    ],
                  },
                },
                // Right side: avatar and name
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "48px",
                            color: BRAND_COLOR,
                            fontWeight: 700,
                          },
                          children: "naps.pt",
                        },
                      },
                      avatarDataUrl
                        ? {
                            type: "img",
                            props: {
                              src: avatarDataUrl,
                              style: {
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                              },
                            },
                          }
                        : null,
                    ].filter(Boolean),
                  },
                },
              ],
            },
          },
          // Title at the bottom
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexGrow: 1,
                alignItems: "flex-end",
                width: "100%",
              },
              children: {
                type: "div",
                props: {
                  style: {
                    fontSize: "72px",
                    color: PRIMARY_TEXT_COLOR,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    maxWidth: "100%",
                  },
                  children: post.title,
                },
              },
            },
          },
        ],
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
      fonts,
    },
  );

  // Convert SVG to PNG using sharp
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return pngBuffer;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log("This script is now integrated into build-banners.ts");
  console.log("Run 'yarn banners' to generate missing meta images");
}
