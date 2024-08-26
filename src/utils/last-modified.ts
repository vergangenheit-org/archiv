import { execSync } from "child_process"

export function getLastModifiedDate(filepath: string): Date {
  const result = execSync(
    `git log -1 --pretty="format:%cI" "${filepath}"`
  ).toString()
  return new Date(result || Date.now())
}
