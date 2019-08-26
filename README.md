# Swift Theme

This theme is designed for blogging purposes. Feel free to extend it for other
use cases though.

At its core, it's minimalistic; it doesn't rely on monolithic libraries such e.g
jquery, bootstrap. Instead, it uses *grid css*, *flexbox* & *vanilla js* to
facilitate the `features` outlined below:

![Hugo Swift Theme](https://github.com/onweru/hugo-swift-theme/blob/master/images/screenshot.png)

## Features

* Blog
* Pagination
* Responsive
* Deeplinks
* Dark Mode
* Syntax Highlighting
* [Staticman](#staticman-comments)
  * [reCAPTCHA](https://developers.google.com/recaptcha/docs/display)

## Installation

Add this theme as a Git submodule inside your Hugo site folder:

```bash
git submodule add https://github.com/onweru/hugo-swift-theme.git themes/hugo-swift-theme
```

> Theme hugo sass and hugo-extended version.

## Configuration

You can configure the site using as follows:

1. **General Information** and **Staticman config**

    Use the file `config.toml`.

2. **menu**, **footer**

    See the **data** files inside the `data/` directory.

> Follow the `exampleSite/`.

## Staticman Comments

By default, [Staticman](https://staticman.net) comments are disabled.
To enable them, you may refer to the
[Staticman config Wiki](https://github.com/onweru/hugo-swift-theme/wiki/staticman-config).

### Deeplinks

For all content published using markdown, deeplinks will be added to the pages
so that you can share with precision :smiley: Just   hover on a heading and the
link button will pop. Click it to copy.

### Dark Mode

Today most operating systems & browsers support dark mode. Like twitter, which
automatically turns into dark mode when the user chooses darkmode, this theme
does the same thing.

![Dark Mode](https://github.com/onweru/hugo-swift-theme/blob/master/images/darkmode.jpg)

## License

The code is available under the
[MIT license](https://github.com/onweru/hugo-swift-theme/blob/master/LICENSE.md).
