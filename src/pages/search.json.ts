import { getCollection } from "astro:content"
import { create, insertMultiple, save } from "@orama/orama"

export async function GET() {
  const posts: never[] = await getCollection("artikel")

  // create db
  const db = await create({
    schema: {
      id: "string",
      slug: "string",
      body: "string",
      collection: "string",
      data: {
        title: "string",
        // publishedDate: "string",
        publishedPrecision: "string",
        // translatedDate: "string",
        description: "string",
        publication: "string",
        tags: "string[]",
        source: {
          name: "string",
          url: "string",
        },
        authors: "string[]",
      },
    },
  })

  // add files
  await insertMultiple(db, posts)

  return new Response(JSON.stringify(await save(db)), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
