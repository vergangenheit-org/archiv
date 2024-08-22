import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import siteConfig from "../data/site-config.ts"
import { sortItemsByDateDesc } from "../utils/data-utils.ts"

export async function GET(context) {
  const posts = (await getCollection("artikel")).sort(sortItemsByDateDesc)
  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    items: posts.map((item) => ({
      title: item.data.title,
      description: item.data.description,
      link: `/artikel/${item.slug}/`,
      pubDate: item.data.translatedDate.setUTCHours(0),
      customData: `<origPubDate>${item.data.publishedDate.toUTCString()}</origPubDate>`,
    })),
  })
}
