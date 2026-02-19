# Astro Starter Kit: Basics

## Repositorio Inspiración

- [Web_Rico](https://portfolio.ricoui.com/)
- [GitHub_Repositorio](https://github.com/ricocc/ricoui-portfolio/blob/main/src/components/sections/Header.astro)
- [Nexus](https://stvn-portfolio-template.vercel.app/)
- [Brian_Collins](https://portfolio.tailwindtemplate.net/onedev/)
- [Lautaro_Collins](https://lautaro-rodriguez-collins.vercel.app/)
- [Flowbite_Docs](https://flowbite.com/docs/components/alerts/)

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

## Problemas con el texto del Theme Toggle para Desktop

Ocurría un problema de renderizado con este elemento cuando abría en un navegador que tenia el _modo oscuro_ seleccionado por defecto, ya que aparecía el span **Light** en vez del **Dark** que sería lo correcto. Para resolverlo se inicializo la siguiente función:

```js
(function initTheme() {
    const saved = localStorage.getItem("theme");
    const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
})();
```

Aquí se guarda el item _theme_ que esta dentro del Local Storage y/o la preferencia del Sistema, para así añadir o quitar la clase _.dark_ si corresponde. Luego de eso llama a **syncDarkModeIcons()** para alinear los iconos y los textos con el estado actual.
