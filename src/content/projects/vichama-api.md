---
title: Vichama API
img: vichama-api.webp
description: API REST creado con Express y Prisma ORM conectado a una base de datos PostgreSQL, utilizando la metodología MVC (Models - Views - Controllers). Se encarga de gestionar canciones y playlists para ser usados en proyectos externos.
stack:
    - { light: express.js-light.svg, dark: express.js-dark.svg }
    - { light: prisma-light.svg, dark: prisma-dark.svg }
    - typescript.svg
    - postgresql.svg
category: Backend
isFeatured: true
urls:
    demo: https://vichama-api-production.up.railway.app/
    code: https://github.com/DaAlexis24/vichama-api
---

**Vichama API** nace de la necesidad de crear un componente para mi portafolio web, ya que quería añadir un reproductor de música y no quería sobrecargar la carpeta public del proyecto.

Intente utilizar la API pública de _Spotify_, de _Deezer_ o la de _Last.fm_, pero el problema era que no me permitían generar una API KEY sin pagar antes o que el audio no duraba lo que yo quería.

Es por ello que se creo este repositorio, donde se utilizo la metodología Model - View - Controller (MVC) para poder crear una API REST que nos permite:

1. Añadir las canciones que requiera
2. Crear las playlists que quiera
3. Poder añadir y eliminar canciones a la playlist que necesite
4. Hacer fetch de la playlist para así coger las canciones

Se utilizo **Prisma** a la hora de construir las tablas de mi base de datos **PostgreSQL** y se levanto el servidor usando **Express.js**, de esta manera obtuvimos un proyecto robusto, rápido y sencillo de configurar.
