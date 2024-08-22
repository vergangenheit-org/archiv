import { type CollectionEntry } from "astro:content"
import { slugify } from "./common-utils"

type NameAndSlug = {
  name: string
  slug: string
}

function filterBySlug(obj: NameAndSlug, pos: number, arr: NameAndSlug[]) {
  return arr.map((mapObj) => mapObj.slug).indexOf(obj.slug) === pos
}

function nameAndSlug(str: string) {
  return { name: str, slug: slugify(str) }
}

export function sortItemsByDateDesc(
  itemA: CollectionEntry<"artikel">,
  itemB: CollectionEntry<"artikel">
) {
  return (
    new Date(itemB.data.translatedDate).getTime() -
    new Date(itemA.data.translatedDate).getTime()
  )
}

export function sortItemsByName(
  itemA: CollectionEntry<"publikationen">,
  itemB: CollectionEntry<"publikationen">
) {
  if (itemA.data.name < itemB.data.name) {
    return -1
  }
  if (itemA.data.name > itemB.data.name) {
    return 1
  }
  return 0
}

export function getAllTags(posts: CollectionEntry<"artikel">[]) {
  const tags: string[] = [
    ...new Set(posts.flatMap((post) => post.data.tags || []).filter(Boolean)),
  ]
  return tags.map(nameAndSlug).filter(filterBySlug)
}

export function getPostsByTag(
  posts: CollectionEntry<"artikel">[],
  tagSlug: string
) {
  const filteredPosts: CollectionEntry<"artikel">[] = posts.filter((post) =>
    (post.data.tags || []).map((tag: string) => slugify(tag)).includes(tagSlug)
  )
  return filteredPosts
}

export function getAllPublications(posts: CollectionEntry<"artikel">[]) {
  const publications: string[] = [
    ...new Set(posts.map((post) => post.data.publication).filter(Boolean)),
  ]
  return publications.map(nameAndSlug).filter(filterBySlug)
}

export function getPostsByPublication(
  posts: CollectionEntry<"artikel">[],
  publicationSlug: string
) {
  const filteredPosts: CollectionEntry<"artikel">[] = posts.filter(
    (post) => slugify(post.data.publication) === publicationSlug
  )
  return filteredPosts
}
