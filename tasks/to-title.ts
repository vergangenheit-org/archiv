import { titleCase } from "../src/utils/common-utils"
const str = Bun.argv.pop()
console.log(titleCase(str))
