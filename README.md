## Swift Theme
This theme is designed for blogging purposes. Feel free to extend it for other use cases though.

At its core, it's minimalistic; it doesn't rely on monolithic libraries such e.g jquery, bootstrap. Instead, it uses *grid css*, *flexbox* & *vanilla js* to facilitate the `features` outlined below:

![Hugo Swift Theme](https://github.com/onweru/hugo-swift-theme/blob/master/images/screenshot.png)

## Features
* Blog
* Pagination
* Responsive
* Deeplinks
* Dark Mode 
* Syntax Highlighting
* [Staticman](https://staticman.net)
    * [reCAPTCHA](https://developers.google.com/recaptcha/docs/display)

## Installation
Add this theme as a Git submodule inside your Hugo site folder:

```bash
$ git submodule add https://github.com/onweru/hugo-swift-theme.git themes/hugo-swift-theme
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
By default, [Staticman](https://staticman.net) comments are disabled. If you would like to enable them,

1. Invite Staticman to your repo to collaborate.

    - GitHub: View the issue [eduardoboucas/staticman#243](https://github.com/eduardoboucas/staticman/issues/243) for procedures to set up Staticman v3.
    - GitLab: Add the GitLab user associated with your Staticman API endpoint (e.g. **[@staticmanlab](https://gitlab.com/staticmanlab)**) as a "**developer**" for your project by going to **Settings → Members → Invite member**.
    - Framagit: Since Framagit is a fork of GitLab, the overall setup is similar to that on GitLab.  (Note that the Framagit bot is named as **[@staticmanlab1](https://framagit.org/staticmanlab1)**.)

2. Uncomment the `[Params.staticman]` section and input the parameters inside `config.toml` like so

    ```toml
    [Params.staticman]
      endpoint = "https://api.staticman.net"
      gitProvider = "github"
      username = "your-username"
      repository = "hugo-swift-theme"
      branch = "master"
    ```

    In case of empty `endpoint`, it will fallback to the official production instance.
    
    | instance | `endpoint` |
    | --- | --- |
    | official production | `https://api.staticman.net` |
    | GitLab | `https://staticman3.herokuapp.com` |
    | Framagit | `https://staticman-frama.herokuapp.com` |
    
    Remark: You may adjust the `endpoint` to the one that your Staticman bot/GitHub App is associated with.
    
    For `gitProvider`, you can choose either `github` or `gitlab`.  If you're using Framagit, choose `gitlab`.

3. Proceed to setup `staticman.yml`.  Note that this YML file has to be **at the root of your Git repository**.  See the `exampleSite/` and the [Staticman docs](https://staticman.net/docs/) for detailed information of each parameter used in this YML file.

    The parameter `moderation` is for comment moderation, and it defaults to `false`.  If it is switched to `true`, then Staticman will create a pull/merge request instead of directly committing against the `branch`.

    If you are working on GitLab and you have set `moderation: false`, depending on your `branch`, you might need the following steps.

      - protected branch (e.g. `master`):
          Go to **Settings → Repository → Protected Branches** and permit the GitLab bot to push against that branch.
      - unprotected branch (GitHub's default): no measures needed

Optional: It is suggested to enable [reCAPTCHA](https://developers.google.com/recaptcha/docs/display) to avoid massive spam comments. You may refer to `_config.yml` for detailed instructions.

Optional: You may want to configure a webhook to prevent old inactive branches (representing approved comments) from stacking up.  You can refer to [Staticman's documentation](https://staticman.net/docs/webhooks) for details.  Make sure to input the **Payload URL** according to your chosen `endpoint`.  For example, the default `endpoint` is `https://staticman3.herokuapp.com`, so the corresponding **Payload URL** should be `https://staticman3.herokuapp.com/v1/webhook`.

:information_source: This [Binary Mist article](https://binarymist.io/blog/2018/02/24/hugo-with-staticman-commenting-and-subscriptions/) could also be quite helpful :)

:information_source: By default, this theme uses the official production instance at v3 instead of v2 due to a requests' quota issue reported in issue [eduardoboucas/staticman#222](https://github.com/eduardoboucas/staticman/issues/222).

:warning: Since Staticman is an evolving project, things might work differently than they do at the moment of this writing.

### Deeplinks

For all content published using markdown, deeplinks will be added to the pages so that you can share with precision :smiley: Just   hover on a heading and the link button will pop. Click it to copy.

### Dark Mode

Today most operating systems & browsers support dark mode. Like twitter, which automatically turns into dark mode when the user chooses darkmode, this theme does the same thing.

![Dark Mode](https://github.com/onweru/hugo-swift-theme/blob/master/images/darkmode.jpg)

## License
The code is available under the [MIT license](https://github.com/onweru/hugo-swift-theme/blob/master/LICENSE.md).
