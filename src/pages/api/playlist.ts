import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
    const PLAYLIST_URL = import.meta.env.PUBLIC_PLAYLIST_API_URL;

    if (!PLAYLIST_URL) {
        return new Response(
            JSON.stringify({
                error: "Falta la variable de entorno correspondiente en .env",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    const res = await fetch(PLAYLIST_URL);

    if (!res.ok) {
        return new Response(
            JSON.stringify({ error: `Error HTTP ${res.status}` }),
            {
                status: res.status,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
};
