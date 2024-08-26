export function slugify(input?: string) {
  if (!input) return ""

  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/[\s-]+/g, "-")
}

export function titleCase(input?: string) {
  if (!input) return ""
  const arr = input.toLowerCase().split(" ")
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
  }
  return arr.join(" ")
}
