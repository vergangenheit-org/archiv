import { stdin } from "node:process"
import { slugify } from "../src/utils/common-utils"
let input
if (stdin.isTTY) {
  input = process.argv[2]
  if (!input) {
    console.error("Please provide an argument or pipe input")
    process.exit(1)
  }
} else {
  const chunks = []
  for await (const chunk of stdin) {
    chunks.push(chunk)
  }
  input = Buffer.concat(chunks).toString().trim()
}
console.log(slugify(input))
