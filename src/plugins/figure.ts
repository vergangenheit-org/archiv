import { visit } from "unist-util-visit"
import { whitespace } from "hast-util-whitespace"
import { remove } from "unist-util-remove"
import { h } from "hastscript"

import type { Root, Element } from "hast"

export type FigureOptions = {
  className?: string
}

export function figure(options = {}) {
  return (tree: Root) => {
    // unwrap the images inside the paragraph
    visit(tree, { tagName: "p" }, (node, index, parent) => {
      if (!hasOnlyImages(node as Element)) {
        return
      }

      remove(node, "text")

      if (parent) {
        parent.children.splice(index as number, 1, ...node.children)
      }

      return index
    })

    // wrap images in figure
    visit(
      tree,
      (node) => isImageWithAlt(node as Element),
      (node, _, parent) => {
        node = node as Element
        parent = parent as Element

        if (isImageWithCaption(parent) || isImageLink(parent)) {
          return
        }

        const figure = createFigure(node, options)

        node.tagName = figure.tagName
        node.children = figure.children
        node.properties = figure.properties
      }
    )
  }
}

function hasOnlyImages({ children }: Element) {
  return children.every(
    (child) => (child as Element).tagName === "img" || whitespace(child)
  )
}

function isImageWithAlt({ tagName, properties }: Element) {
  return tagName === "img" && Boolean(properties.alt) && Boolean(properties.src)
}

function isImageWithCaption({ tagName, children }: Element) {
  return (
    tagName === "figure" &&
    children.some((child) => (child as Element).tagName === "figcaption")
  )
}

function isImageLink({ tagName }: Element) {
  return tagName === "a"
}

function createFigure({ properties }: Element, options: FigureOptions) {
  const props = options.className ? { class: options.className } : {}
  return h("figure", props, [
    h("img", { ...properties }),
    h("figcaption", properties.alt as string),
  ])
}
