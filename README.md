# Tricerátops Show

website for Tricerátops Show, brazilian alternative music podcast

[www.triceratops.show](https://www.triceratops.show)

based on the ![Castanet](https://github.com/mattstratton/castanet) theme

## setup

requires: go, hugo, node

everything you need should be in the `Makefile`

## structure

- `checks` contains verifications and tests to run locally or in CI
- `scripts` contains miscellaneous helper scripts

## develop

### live reload

```
make serve
```

will start hugo + netlify cms server

### fontawesome icons

the fontawesome files in `static/fonts` are subsets containing only the icons that are actually used.

to include a new icon:
1. [search](https://fontawesome.com/icons) the corresponding unicode for the icon
2. add it to `scripts/fontawesome-subset.sh`
3. run the script to generate the new font files
