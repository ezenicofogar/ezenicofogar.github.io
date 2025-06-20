# ezenicofogar.github.io

## Build

This project is a static page built from templates (using Eleventy). To build the project, run:

```
npm install
```
```
npm run build-all
```

:warning: The resulting files should be already in the `docs` folder.

### For active development

Run Eleventy (templates) and Tailwind (styles) as separated watchers.

#### Eleventy

```
npx eleventy --watch
```

#### Tailwind

```
npx tailwindcss -i ./tailwind/tailwind.css -o ./docs/static/css/style.css --watch
```

#### Server

You can just open `docs/index.html`, or serve to localhost with [`statichost`](https://github.com/ezenicofogar/statichost/releases), my simple static server.

```
statichost -L ./docs
```

## Which tools are used?

- ### [Eleventy](https://www.11ty.dev/)

    *MIT License*

- ### [Tailwind CSS](https://tailwindcss.com/)

    *MIT License*

- ### [Lenis](https://lenis.darkroom.engineering/)

    *MIT License*

- ### [Gsap](https://gsap.com/)

    [*Standard "No Charge" GSAP License*](https://gsap.com/community/standard-license/)
