import { slugify } from "../src/utils/common-utils"
const title = Bun.argv.pop()
console.log(slugify(title))
