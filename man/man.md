> The react static site generator that separates editing and code concerns

To learn more about how to make a new website with Cuttlebelle, visit [https://cuttlebelle.com](https://cuttlebelle.com)


## SYNOPSIS

`cuttlebelle  [init]  [-i]  [docs]  [-d]  [watch]  [-w]  [--no-generate]  [-n]  [--silent]  [-s]  [--version]  [-V]  [--verbose]  [-v]`


## DESCRIPTION

Cuttlebelle is a react static site generator that separates editing and code concerns.

## WEBSITE

[https://cuttlebelle.com](https://cuttlebelle.com)

## EXAMPLES

`npm install cuttlebelle -g`

`cuttlebelle init`

`cuttlebelle`

`cuttlebelle docs`

`cuttlebelle watch`


## OPTIONS

`init`, `-i`
	Create a clean slate website to get you started

`docs`, `-d`
	Build documentation from your layout components

`watch`, `-w`
	Start to watch the content and source folder for changes

`--no-generate`, `-n`
	Disable generation of all pages, best in combination with watch

`--silent`, `-s`
	Disable all notifications the watch might throw

`--version`, `-V`
	Display the version of Cuttlebelle

`--verbose`, `-v`
	Enable silly verbose mode


## CONFIGURATION

For configuring use the `package.json` and add the `cuttlebelle` object.

Defaults:

```json
{
  "name": "example settings",
  "private": true,
  "cuttlebelle": {
    "folder": {
      "content": "content/",
      "code": "code/",
      "assets": "assets/",
      "site": "site/",
      "docs": "docs/",
      "index": "index",
      "homepage": "index"
    },
    "layouts": {
      "page": "page",
      "partial": "partial"
    },
    "site": {
      "root": "/",
      "doctype": "<!DOCTYPE html>",
      "redirectReact": true,
      "markdown": {
        "headingIds": true,
        "plugins": []
      },
      "watchTimeout": 400
    },
    "docs": {
      "root": "files/",
      "index": "./../.template/docs/layout/index.js",
      "category": "./.template/docs/layout/category.js",
      "IDProp": "page2",
      "selfProp": "body.md",
      "navProp": {
        "index": {
          "page1": "page1",
          "page2": {
            "page2/nested": "page2/nested"
          },
          "page3": "page3"
        }
      },
      "pagesProp": {
        "page1": {
          "url": "/page1",
          "title": "Page 1"
        },
        "page2": {
          "url": "/page2",
          "title": "Page 2"
        },
        "page2/nested": {
          "url": "/page2/nested",
          "title": "Nested in page 2"
        },
        "page3": {
          "url": "/page3",
          "title": "Page 3"
        },
        "index": {
          "url": "/",
          "title": "Homepage"
        }
      }
    }
  }
}
```


## BUGS

Please report any bugs to https://github.com/cuttlebelle/cuttlebelle.


## LICENSE

Copyright (c) 2018, Dominik Wilkowski (GPL-3.0 License).


## SEE ALSO

node.js(1), react(1), static-site-generator(1)
