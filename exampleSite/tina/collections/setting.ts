import { Collection } from "tinacms";

const Setting: Collection = {
  name: "setting",
  label: "Theme Settings",
  path: "config/_default",
  format: "toml",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    }
  },
  match: {
    include: "*params*",
  },
  fields: [
    {
      type: "string",
      name: "blogDir",
      label: "Blog Directory",
      description: "Content section used as the blog (e.g. posts)"
    },
    {
      type: "boolean",
      name: "audio_graphic",
      label: "Show Audio Graphic",
      description: "Show animated wave on homepage. Defaults to true."
    },
    {
      type: "string",
      name: "ga_analytics",
      label: "Google Analytics ID",
      description: "e.g. UA-116386578-1"
    },
    {
      type: "string",
      name: "ga_verify",
      label: "Google Site Verification",
    },
    {
      type: "string",
      name: "twitter",
      label: "Twitter Handle",
      description: "e.g. @weru"
    },
    {
      type: "string",
      name: "author",
      label: "Default Author",
    },
    {
      type: "image",
      name: "logo",
      label: "Site Logo",
    },
    {
      type: "image",
      name: "image",
      label: "Default Post Image",
      description: "Used when a post has no image set"
    },
    {
      type: "object",
      name: "designer",
      label: "Designer Attribution",
      fields: [
        {
          type: "string",
          name: "name",
          label: "Name"
        },
        {
          type: "string",
          name: "url",
          label: "URL"
        }
      ]
    },
    {
      type: "object",
      name: "authors",
      label: "Authors",
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.fullName || item?.name };
        }
      },
      fields: [
        {
          type: "string",
          name: "name",
          label: "Username / Nickname",
          required: true,
          description: "Used to match posts by the 'author' frontmatter field"
        },
        {
          type: "string",
          name: "fullName",
          label: "Full Name",
          description: "If set, displayed on the author card instead of name"
        },
        {
          type: "string",
          name: "bio",
          label: "Bio",
          ui: {
            component: "textarea"
          }
        },
        {
          type: "image",
          name: "photo",
          label: "Photo"
        },
        {
          type: "string",
          name: "url",
          label: "Profile / Portfolio URL"
        }
      ]
    },
  ]
};

export default Setting;
