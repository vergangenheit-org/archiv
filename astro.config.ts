import { defineConfig } from "astro/config"
import { readFileSync } from "fs"
import { directives, figure } from "./src/plugins/index"
import { blackAndWhite } from "./src/plugins/openGraphRenderer"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import opengraphImages from "astro-opengraph-images"
import rehypeExternalLinks from "rehype-external-links"
import remarkDirective from "remark-directive"
import vue from "@astrojs/vue"

import type { ElementContent } from "hast"

// https://astro.build/config
export default defineConfig({
  site: "https://vergangenheit.org",
  integrations: [
    mdx(),
    vue(),
    sitemap(),
    tailwind({
      applyBaseStyles: false,
    }),
    opengraphImages({
      options: {
        fonts: [
          {
            name: "Newsreader",
            weight: 500,
            style: "normal",
            data: readFileSync("public/fonts/newsreader.woff"),
          },
        ],
      },
      render: blackAndWhite,
    }),
  ],
  markdown: {
    remarkPlugins: [remarkDirective, directives],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: ["nofollow", "noopener", "noreferrer"],
          target: "_blank",
          content: { type: "text", value: " ↗" },
        },
      ],
      [figure, { className: "text-center *:mx-auto *:mx-1.5" }],
    ],
    remarkRehype: {
      footnoteLabel: "Fußnoten",
      footnoteBackLabel: (referenceIndex, rereferenceIndex) => {
        return (
          "Zurück zu Verweis " +
          (referenceIndex + 1) +
          (rereferenceIndex > 1 ? "-" + rereferenceIndex : "")
        )
      },
      footnoteBackContent: (_, rereferenceIndex) => {
        const result: Array<ElementContent> = [{ type: "text", value: "⤴" }]

        if (rereferenceIndex > 1) {
          result.push({
            type: "element",
            tagName: "sup",
            properties: {},
            children: [{ type: "text", value: String(rereferenceIndex) }],
          })
        }

        return result
      },
    },
  },
})
