---
title: Tienda - La Palmerita de Morata
img: la-palmerita-web.webp
description: Tienda Virtual para la pastelería/panadería La Palmerita de Morata usando la metodología Headless CMS
stack:
    - nextjs.svg
    - prestashop.svg
    - typescript.svg
    - tailwindcss.svg
    - nodejs.svg
category: FullStack
isFeatured: true
urls:
    demo: https://lapalmeritademorataenmadrid.es/
---

Fui parte de la creación de esta tienda virtual, utilizando la metodología de **Headless CMS**, esta consiste en crear un _frontend_ utilizando cualquier framework que requiera y se comunicará con una plataforma CMS utilizando una API REST.

Para el frontend elegí **Next.Js** debido a que funciona mediante **SSR** (Server Side Rendering) y esto es muy útil a la hora de manejar APIs, potencia el SEO mediante el pre-renderizado estático (**SSG**) y es fácil de usar si es que has manejado React en el pasado.

Para el CMD decidí usar **Prestashop** ya que es _OpenSource_ y esto me daba flexibilidad a la hora de modificar el código, cuenta con un buen apartado SEO, permite crear distintos tipos de producto y cuenta con distintos plugins gratuitos con el cuál podemos adaptar el tema hasta configurar los pagos en la web.

Los principales retos que tuve con este proyecto fueron:

- Crear el producto para las cajas de las palmeritas, ya que Prestashop no tiene un módulo más profesional para generar _product bundles_
- Gestionar los endpoints para poderlos enlazar con Next.js
- Generar los tipos para manejar los datos de la API.
