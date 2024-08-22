export type Image = {
  src: string
  alt?: string
  caption?: string
}

export type Link = {
  text: string
  href: string
}

export type Hero = {
  title?: string
  text?: string
  image?: Image
  actions?: Link[]
}

export type Subscribe = {
  title?: string
  text?: string
  formUrl: string
}

export type SiteConfig = {
  logo?: Image
  title: string
  subtitle?: string
  description: string
  image?: Image
  headerNavLinks?: Link[]
  footerNavLinks?: Link[]
  socialLinks?: Link[]
  hero?: Hero
  subscribe?: Subscribe
  postsPerPage?: number
  projectsPerPage?: number
}

const siteConfig: SiteConfig = {
  title: "Vergangenheit.org",
  // subtitle: "Nachrichten übersetzt in Deutsch",
  description: "Nachrichten aus der Vergangenheit in Deutsch übersetzt",
  image: {
    src: "/preview.jpg",
    alt: "Vorschau der Webseite",
  },
  headerNavLinks: [
    {
      text: "startseite",
      href: "/",
    },
    {
      text: "artikel",
      href: "/artikel",
    },
    {
      text: "publikationen",
      href: "/publikationen",
    },
    {
      text: "tags",
      href: "/tags",
    },
  ],
  footerNavLinks: [
    {
      text: "Kontakt",
      href: "javascript:location='mailto:\u0069\u006e\u0066\u006f\u0040\u0076\u0065\u0072\u0067\u0061\u006e\u0067\u0065\u006e\u0068\u0065\u0069\u0074\u002e\u006f\u0072\u0067';void 0",
    },
    // {
    //   text: "Contact",
    //   href: "/contact"
    // },
    // {
    //   text: "Terms",
    //   href: "/terms"
    // }
  ],
  socialLinks: [
    {
      text: "CodeBerg",
      href: "https://codeberg.org/vergangenheit/archiv",
    },
  ],
  postsPerPage: 8,
}

export default siteConfig
