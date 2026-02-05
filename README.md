# Astro Starter Kit: Basics

## Repositorio Inspiración

- [Web_Rico](https://portfolio.ricoui.com/)
- [GitHub_Repositorio](https://github.com/ricocc/ricoui-portfolio/blob/main/src/components/sections/Header.astro)

```sh
npm create astro@latest -- --template basics
```

## Lighthouse Issues

### Improve Image Delivery

Tenía problemas a la hora de actualizar la web ya que mis imágenes pesaban mucho y no renderizaban bien, por ello realice lo siguiente:

1. Guardaré las imágenes que quiera usar en mi proyecto dentro de la carpeta **assets** en una subcarpeta llamada **images**
2. Creamos un componente ASTRO para guardar esas imágenes usando la etiqueta de Astro **Image**

3. Podemos agregar _props_ para poder modificar el componente según lo que necesitemos.
4. Realizamos lo siguiente: `<Image src={your_image} alt="explain_image" class={className} layout="constrained" width={width} height={height} fetchpriority="high" loading=eager />`
    1. Constrained lo que hace es generar tamaños responsivos de tu imagen y se usarán según el tamaño del viewport
    2. Fetchpriority sirve para que las imágenes hagan un render antes de los demás componentes
    3. Loading eager logra que la imagen cargue de manera rápida al realizar la conexión con el servidor. Al ser una información puntual, no habrá problemas de perdida de información

### Render Blocking Request

Este problema ocurre debido a enlaces externos, en este caso esto ocurrió por **@imports** en **global.css** y por el script que se requiere para poder usar los componentes de **Flowbite**

Se soluciono realizando lo siguiente:

1. Se reemplazaron los **@import** con **@font-face**. Antes descargue las fuentes y las coloque dentro de **assets**.
2. Coloque el script de Flowbite dentro del **body** de **Layout.astro** junto con el atributo **defer**.

### Document should have one main landmark

Para este problema solo añadí el atributo **role** dentro del header, navigation menu, main y footer.

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
