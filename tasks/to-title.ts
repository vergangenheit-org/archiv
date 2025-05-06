import { titleCase } from "../src/utils/common-utils"
const str =
  Bun.argv[2] || (await Bun.readableStreamToText(Bun.stdin.stream()))?.trim()
console.log(titleCase(str))
