import readingTime from "reading-time"
import { fromMarkdown } from "mdast-util-from-markdown"
import { toString } from "mdast-util-to-string"

export const getReadingTime = (text: string): string => {
  if (!text || !text.length) return ""
  const { minutes } = readingTime(toString(fromMarkdown(text)))
  if (minutes && minutes > 0) {
    const mins = Math.ceil(minutes)
    return `Lesezeit ${mins} ${mins == 1 ? "Minute" : "Minuten"}`
  }
  return ""
}
