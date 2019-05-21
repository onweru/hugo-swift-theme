## Swift Theme
This theme is designed for blogging purposes. That said, it's extendable for other use cases.

![](https://github.com/onweru/hugo-swift-theme/blob/master/images/tn.png)

## Features
* Blog
* Pagination
* Responsive
* Staticman

## Installation
Run the following inside your Hugo site folder:

```bash
$ mkdir themes
$ cd themes
$ git clone https://github.com/onweru/hugo-swift-theme
```

> Theme hugo sass and hugo-extended version.

## Configuration
You can configure the site using as follows:
1. **General Information**

  Use **config.toml** file

2. **menu**, **staticman**, **footer**

See the **data** files inside the data directory

> Follow the exampleSite

This theme is designed to work with data files. Feel free to extend/alter as you would like.

## Staticman Comments
By default, staticman comments are disabled. If you would like to enable them,

1. Toggle the *staticman* param inside the config.toml to ```true``` like so

```yaml
+++
...
[params]
  staticman = true
...
+++
```

Then proceed to setup staticman in **staticman.yml**. See the example site and the [staticman docs](https://staticman.net/docs/) for reference.

This [Binary Mist article](https://binarymist.io/blog/2018/02/24/hugo-with-staticman-commenting-and-subscriptions/) could also be quite helpful :)

> For any one intending to use staticman with hugo please have a look at [this issue/thread](https://github.com/eduardoboucas/staticman/issues/243). Why? you may wan't to stay away from the public instance of staticman due to a requests' quota issue. Also you may want to use V3 of staticman. The issue I referenced has clear pointers; please go through the thread in its entirety if you can :).

Since staticman is an involving project, things might work differently than they do at the moment of this writing.

## License
The code is available under the [MIT license](https://github.com/onweru/hugo-swift-theme/blob/master/LICENSE.md).
