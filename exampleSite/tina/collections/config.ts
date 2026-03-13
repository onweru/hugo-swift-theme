import { Collection } from "tinacms";

const Config: Collection = {
  name: "config",
  label: "Site Config",
  path: "config/_default",
  format: "toml",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    }
  },
  match: {
    include: "*hugo*",
  },
  fields: [
    {
      type: "string",
      name: "baseurl",
      label: "Base URL",
      description: "e.g. https://example.com/"
    },
    {
      type: "string",
      name: "title",
      label: "Site Title"
    },
    {
      type: "string",
      name: "author",
      label: "Site Author"
    },
    {
      type: "string",
      name: "copyright",
      label: "Copyright"
    },
    {
      type: "string",
      name: "theme",
      label: "Theme Name"
    },
    {
      type: "object",
      name: "pagination",
      label: "Pagination",
      fields: [
        {
          type: "boolean",
          name: "disableAliases",
          label: "Disable aliases",
          description: "https://gohugo.io/configuration/pagination/#disablealiases"
        },
        {
          type: "number",
          name: "pagerSize",
          label: "Items per page",
        },
        {
          type: "string",
          name: "path",
          label: "Path",
          description: "https://gohugo.io/configuration/pagination/#path"
        }
      ]
    },
  ]
}

export default Config;
