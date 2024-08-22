import { visit } from "unist-util-visit"
import { toHast } from "mdast-util-to-hast"
import { h, s } from "hastscript"
import type { Directives } from "mdast-util-directive"
import type { Root } from "mdast"
import type { VFile } from "vfile"
import type { Element } from "hast"

const icons = {
  note: s(
    "svg.mr-2",
    {
      viewBox: "0 0 16 16",
      height: "16",
      width: "16",
      fill: "currentColor",
      "aria-hidden": "true",
    },
    [
      s("path", {
        d: "M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z",
      }),
    ]
  ),
  tip: s(
    "svg.mr-2",
    {
      viewBox: "0 0 16 16",
      height: "16",
      width: "16",
      fill: "currentColor",
      "aria-hidden": "true",
    },
    [
      s("path", {
        d: "M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z",
      }),
    ]
  ),
  important: s(
    "svg.mr-2",
    {
      viewBox: "0 0 16 16",
      height: "16",
      width: "16",
      fill: "currentColor",
      "aria-hidden": "true",
    },
    [
      s("path", {
        d: "M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z",
      }),
    ]
  ),
  warning: s(
    "svg.mr-2",
    {
      viewBox: "0 0 16 16",
      height: "16",
      width: "16",
      fill: "currentColor",
      "aria-hidden": "true",
    },
    [
      s("path", {
        d: "M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z",
      }),
    ]
  ),
  caution: s(
    "svg.mr-2",
    {
      viewBox: "0 0 16 16",
      height: "16",
      width: "16",
      fill: "currentColor",
      "aria-hidden": "true",
    },
    [
      s("path", {
        d: "M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z",
      }),
    ]
  ),
}

function youtube(node: Directives) {
  const data = node.data || (node.data = {})
  const { id, class: className } = node.attributes || {}

  if (node.type === "textDirective") {
    throw "Unexpected `:youtube` text directive, use two colons for a leaf directive"
  }

  if (!id) {
    throw "Unexpected missing `id` on `youtube` directive"
  }

  data.hName = "iframe"
  data.hProperties = {
    src: "https://www.youtube-nocookie.com/embed/" + id,
    class: className,
    frameBorder: 0,
    allow: "picture-in-picture",
    allowFullScreen: true,
  }
}

function alerts(node: Directives) {
  const data = node.data || (node.data = {})
  const { id, class: className } = node.attributes || {}

  if (node.type === "textDirective") {
    throw `Unexpected ":${node.name}" text directive, use two colons for a leaf directive`
  }

  data.hName = "div"
  data.hProperties = {
    id,
    class: [
      "px-4 border-l-2",
      node.name === "note" ? "border-blue-500" : "",
      node.name === "tip" ? "border-green-500" : "",
      node.name === "important" ? "border-violet-500" : "",
      node.name === "warning" ? "border-yellow-500" : "",
      node.name === "caution" ? "border-red-500" : "",
      className,
    ].join(" "),
  }
  data.hChildren = [
    h(
      "p",
      {
        dir: "auto",
        class: [
          "flex font-bold items-center leading-none",
          node.name === "note" ? "text-blue-500" : "",
          node.name === "tip" ? "text-green-500" : "",
          node.name === "important" ? "text-violet-500" : "",
          node.name === "warning" ? "text-yellow-500" : "",
          node.name === "caution" ? "text-red-500" : "",
        ].join(" "),
      },
      node.name === "note"
        ? [icons.note, "Notiz"]
        : node.name === "tip"
          ? [icons.tip, "Tip"]
          : node.name === "important"
            ? [icons.important, "Wichtig"]
            : node.name === "warning"
              ? [icons.warning, "Warnung"]
              : node.name === "caution"
                ? [icons.caution, "Achtung"]
                : []
    ),
    ...(node.children.map(toHast) as Element[]),
  ]
}

function twitter(node: Directives) {
  const data = node.data || (node.data = {})
  const { class: className, id, user, date } = node.attributes || {}
  const formatted = new Date(date as string).toLocaleDateString("de-de", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  if (node.type === "textDirective") {
    throw `Unexpected ":${node.name}" text directive, use two colons for a leaf directive`
  }

  data.hName = "div"
  data.hProperties = {
    class: [
      "flex flex-col justify-center border border-slate-300 rounded-xl my-5 p-5 max-w-xl mx-auto not-prose",
      className,
    ].join(" "),
  }
  data.hChildren = [
    h("p", [...(node.children.map(toHast) as Element[])]),
    h(
      "a",
      {
        class: "flex items-center grap-3 group no-underline mt-3",
        href: `https://x.com/${user}/status/${id}`,
      },
      [
        h("div", { class: "flex flex-col leading-snug text-sm mr-2" }, [
          h("span", { class: "font-semibold" }, [`@${user}`]),
          h(
            "span",
            { class: "opacity-80 group-hover:opacity-100 duration-300" },
            [`${formatted}`]
          ),
        ]),
      ]
    ),
  ]
}

function lead(node: Directives) {
  const data = node.data || (node.data = {})
  data.hName = "div"
  data.hProperties = { class: "lead" }
}

export function directives() {
  return function (tree: Root, file: VFile) {
    visit(tree, (node) => {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        try {
          switch (node.name) {
            case "youtube":
              youtube(node)
              break
            case "twitter":
              twitter(node)
              break
            case "note":
            case "tip":
            case "important":
            case "warning":
            case "caution":
              alerts(node)
              break
            case "lead":
              lead(node)
              break
            default:
              throw `No implementation found for directive "${node.name}".`
          }
        } catch (err: unknown) {
          if (typeof err === "string") {
            file.fail(err, node)
          } else if (err instanceof Error) {
            file.fail(err.message, node)
          } else {
            file.fail("Unknown error happened", node)
          }
        }
      }
    })
  }
}
