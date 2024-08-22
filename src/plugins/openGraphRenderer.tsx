import type { RenderFunctionInput } from "astro-opengraph-images"
import React from "react"

// from https://fullstackheroes.com/resources/vercel-og-templates/simple/
export async function blackAndWhite({
  title,
}: RenderFunctionInput): Promise<React.ReactNode> {
  const twj = (await import("tw-to-css")).twj
  const [headline, website] = title.split(" | ")

  return (
    <div
      style={twj(
        "h-full w-full flex items-start justify-start border border-neutral-900 border-[12px] bg-[#f2f1ec]"
      )}
    >
      <div style={twj("flex items-start justify-start h-full")}>
        <div style={twj("flex flex-col justify-between w-full h-full")}>
          <h1 style={twj("text-[80px] p-20 font-neutral-900 text-left")}>
            {headline}
          </h1>
          <div
            style={twj("text-2xl pb-10 px-20 font-neutral-900 font-bold mb-0")}
          >
            {website}
          </div>
        </div>
      </div>
    </div>
  )
}
