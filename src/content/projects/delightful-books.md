---
title: Delightful Books
img: delightful-books.webp
description: Landing Page de libros donde usamos Astro 5, y así probamos sus nuevas funcionalidades - Content Layer y Server Islands
stack:
    - { light: astro-light.svg, dark: astro-dark.svg }
    - typescript.svg
    - tailwindcss.svg
urls:
    demo: https://dev-books-tawny.vercel.app/
    code: https://github.com/DaAlexis24/delightful-books
---

Este proyecto se realizó con el fin de poder probar las nuevas funcionalidades que trajo la última versión del framework **Astro**: la 5.0.

Se han utilizado el concepto de **Content Layer** a la hora de generar las _cards_ y los artículos de cada uno de los libros. Esto se logró usando un archivo de configuración usando las librerías **defineCollection** y **Zod** que son nativas del módulo **Astro Content** y de varios archivos markdown.

La ventaja de los markdown a diferencia de los JSON es que pueden tener un _front-matter_ donde podemos definir sus características, mientras podemos escribir y estilizar el markdown como normalmente se suele hacer.

> Si en algún momento las colecciones dejan de ser reconocidas por el proyecto, solo tenemos que ejecutar el siguiente comando en la terminal: `npx astro sync`
> Esto limpiará la cache y todo regresará a la normalidad

Luego creamos las distintas páginas para cada libro usando **enrutamiento**, creando una carpeta llamada **libro** dentro del directorio _pages_ y dentro de él se creo un nuevo archivo llamado `[id].astro`, donde vamos a desplegar toda la información.

Para el enrutamiento también vamos a usar la función asíncrona **getStaticPaths** que se apoyará en la colección que hemos creado, esto nos devolverá un array de objetos con los params y el contenido del markdown, contenido que vamos a renderizar y a convertir en una etiqueta usando la función **render** de **Astro Content**

Después de eso vimos las nuevas transiciones de Astro, que ahora están definidas con el módulo **ClientRouter**. Este se importará en el head del _Layout_ donde la queramos usar.

Esto nos generará un nuevo atributo llamado **transition-name** que podremos usar en cualquier elemento del archivo, en este caso fue dentro de las imágenes.

Y para finalizar, hemos usado los **Server Island**. Estos renderizan la información en el servidor para devolverlos en el cliente de manera automática. Lograremos esto siguiendo los siguientes pasos:

1. Añadir la propiedad **output** con el valor _server_ dentro de **astro.config**
2. Seleccionar los componentes que queremos convertir en Server Islands usando la propiedad **server** con el valor _defer_.

Esto sumado a la funcionalidad de definir que componentes queremos mantener estáticos con la constante `export const prerender = true` nos dan los siguientes beneficios:

- Mejor performance
- Evitamos CORS
- Mayor seguridad a la hora de acceder a un API

> Proyecto basado en el curso de Astro 5 realizado por [MiduDev](https://www.youtube.com/@midudev)
