import { titleCase } from "../src/utils/common-utils"
const str =
  (await Bun.readableStreamToText(Bun.stdin.stream()))?.trim() || Bun.argv[2]
console.log(titleCase(str))
