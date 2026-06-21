const LS_KEY = "music-player-state-v1";
const PLAYLIST_URL = '/api/playlist';

const state = {
    playlist: null,
    queue: [],
    cursor: 0,
    isPlaying: false,
    isShuffle: false,
    isMuted: false,
    volume: 0.7,
    lastPersistSec: -1,
};

const $ = (id) => {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Elemento #${id} no encontrado`);
    return el;
};

const fmt = (s) => {
    if (!isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
};

function showError(msg) {
    const errEl = $("mp-error");
    errEl.textContent = msg;
    errEl.classList.remove("hidden");
    errEl.classList.add("flex");
}

function hideError() {
    const errEl = $("mp-error");
    errEl.classList.add("hidden");
    errEl.classList.remove("flex");
}

function loadSong(queueIndex) {
    if (!state.playlist) return;
    const realIndex = state.queue[queueIndex];
    const item = state.playlist.songs[realIndex];
    if (!item) return;
    const song = item.song;

    const audio = $("mp-audio");
    const cover = $("mp-cover");
    const skeleton = $("mp-cover-skeleton");
    const title = $("mp-title");
    const artist = $("mp-artist");

    skeleton.classList.remove("hidden");
    cover.style.opacity = "0";
    cover.alt = `Portada: ${song.title} — ${song.artist}`;
    cover.onload = () => {
        cover.style.opacity = "1";
        skeleton.classList.add("hidden");
    };
    cover.onerror = () => {
        skeleton.classList.add("hidden");
    };
    cover.src = song.image_url;

    audio.src = song.audio_url;
    audio.load();

    title.textContent = song.title;
    title.title = song.title;
    artist.textContent = song.artist;
    artist.title = song.artist;

    $("mp-progress-fill").style.width = "0%";
    $("mp-progress-thumb").style.left = "0%";
    $("mp-current-time").textContent = "0:00";
    $("mp-duration").textContent = "0:00";
    $("mp-progress-track").setAttribute("aria-valuenow", "0");
}

function swapPlayIcon(isPlaying) {
    $("mp-icon-play").classList.toggle("hidden", isPlaying);
    $("mp-icon-pause").classList.toggle("hidden", !isPlaying);
}

function swapVolumeIcon(isMuted) {
    $("mp-icon-vol-on").classList.toggle("hidden", isMuted);
    $("mp-icon-vol-off").classList.toggle("hidden", !isMuted);
}

function play() {
    const audio = $("mp-audio");
    const p = audio.play();
    if (p && typeof p.then === "function") {
        p.catch((e) => {
            console.warn("No se pudo reproducir:", e);
            state.isPlaying = false;
            swapPlayIcon(false);
        });
    }
}

function pause() {
    const audio = $("mp-audio");
    audio.pause();
}

function togglePlay() {
    if (state.isPlaying) pause();
    else play();
}

function next() {
    if (!state.playlist || state.queue.length === 0) return;
    state.cursor = (state.cursor + 1) % state.queue.length;
    loadSong(state.cursor);
    play();
}

function prev() {
    if (!state.playlist || state.queue.length === 0) return;
    const audio = $("mp-audio");
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }
    state.cursor =
        state.cursor === 0
            ? state.queue.length - 1
            : state.cursor - 1;
    loadSong(state.cursor);
    play();
}

function reshuffleQueue() {
    if (!state.playlist) return;
    const current = state.queue[state.cursor];
    const rest = state.queue
        .filter((_, i) => i !== state.cursor)
        .sort(() => Math.random() - 0.5);
    state.queue = [current, ...rest];
    state.cursor = 0;
}

function toggleShuffle() {
    state.isShuffle = !state.isShuffle;
    $("mp-shuffle").classList.toggle("text-medium-gray", state.isShuffle);
    if (state.isShuffle) reshuffleQueue();
    persist();
}

function toggleMute() {
    const audio = $("mp-audio");
    state.isMuted = !state.isMuted;
    audio.muted = state.isMuted;
    swapVolumeIcon(state.isMuted);
    persist();
}

function setVolume(v) {
    const audio = $("mp-audio");
    const clamped = Math.max(0, Math.min(1, v));
    state.volume = clamped;
    audio.volume = clamped;

    if (clamped > 0 && state.isMuted) {
        state.isMuted = false;
        audio.muted = false;
        swapVolumeIcon(false);
    } else if (clamped === 0 && !state.isMuted) {
        state.isMuted = true;
        audio.muted = true;
        swapVolumeIcon(true);
    }
    persist();
}

function persist() {
    try {
        const audio = $("mp-audio");
        const data = {
            cursor: state.cursor,
            position: isFinite(audio.currentTime) ? audio.currentTime : 0,
            isShuffle: state.isShuffle,
            volume: state.volume,
            isMuted: state.isMuted,
        };
        localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {
        // ignore quota / disabled storage
    }
}

function readPersisted() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return null;
        const s = JSON.parse(raw);
        return {
            cursor: typeof s.cursor === "number" ? s.cursor : 0,
            position: typeof s.position === "number" ? s.position : 0,
            isShuffle: !!s.isShuffle,
            volume:
                typeof s.volume === "number"
                    ? Math.max(0, Math.min(1, s.volume))
                    : 0.7,
            isMuted: !!s.isMuted,
        };
    } catch {
        return null;
    }
}

function applyStateToDOM() {
    const audio = $("mp-audio");
    audio.volume = state.isMuted ? 0 : state.volume;
    audio.muted = state.isMuted;
    $("mp-volume").value = String(state.volume);
    swapVolumeIcon(state.isMuted);
    $("mp-shuffle").classList.toggle("text-medium-gray", state.isShuffle);
    swapPlayIcon(state.isPlaying);
}

function restorePersistedState() {
    const s = readPersisted();
    if (!s) {
        applyStateToDOM();
        loadSong(0);
        return;
    }

    state.isShuffle = s.isShuffle;
    state.volume = s.volume;
    state.isMuted = s.isMuted;

    applyStateToDOM();

    if (state.playlist) {
        const maxCursor = state.playlist.songs.length - 1;
        state.cursor = Math.max(0, Math.min(maxCursor, s.cursor));
        loadSong(state.cursor);

        if (s.position > 0) {
            const audio = $("mp-audio");
            const apply = () => {
                if (isFinite(audio.duration) && audio.duration > 0) {
                    audio.currentTime = Math.min(
                        s.position,
                        audio.duration,
                    );
                } else {
                    audio.currentTime = s.position;
                }
                audio.removeEventListener("loadedmetadata", apply);
            };
            audio.addEventListener("loadedmetadata", apply);
            if (audio.readyState >= 1) apply();
        }
    }
}

function bindEvents() {
    $("mp-play").addEventListener("click", togglePlay);
    $("mp-next").addEventListener("click", next);
    $("mp-prev").addEventListener("click", prev);
    $("mp-shuffle").addEventListener("click", toggleShuffle);
    $("mp-volume-btn").addEventListener("click", toggleMute);
    $("mp-volume").addEventListener("input", (e) => {
        const v = parseFloat(e.target.value);
        if (!isNaN(v)) setVolume(v);
    });

    const audio = $("mp-audio");
    const durationEl = $("mp-duration");
    const fillEl = $("mp-progress-fill");
    const thumbEl = $("mp-progress-thumb");
    const currentEl = $("mp-current-time");
    const trackEl = $("mp-progress-track");

    audio.addEventListener("loadedmetadata", () => {
        durationEl.textContent = fmt(audio.duration);
    });
    audio.addEventListener("durationchange", () => {
        durationEl.textContent = fmt(audio.duration);
    });
    audio.addEventListener("timeupdate", () => {
        if (!isFinite(audio.duration) || audio.duration === 0) return;
        const pct = (audio.currentTime / audio.duration) * 100;
        fillEl.style.width = `${pct}%`;
        thumbEl.style.left = `${pct}%`;
        currentEl.textContent = fmt(audio.currentTime);
        trackEl.setAttribute("aria-valuenow", String(Math.round(pct)));
        const cur = Math.floor(audio.currentTime);
        if (cur !== state.lastPersistSec && cur % 5 === 0) {
            state.lastPersistSec = cur;
            persist();
        }
    });
    audio.addEventListener("ended", next);
    audio.addEventListener("play", () => {
        state.isPlaying = true;
        swapPlayIcon(true);
    });
    audio.addEventListener("pause", () => {
        state.isPlaying = false;
        swapPlayIcon(false);
        persist();
    });
    audio.addEventListener("error", () => {
        console.error("Audio error:", audio.error);
        showError(
            "No se pudo cargar el audio. Probá con la siguiente canción.",
        );
    });

    const seek = (clientX) => {
        if (!isFinite(audio.duration) || audio.duration === 0) return;
        const r = trackEl.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
        audio.currentTime = ratio * audio.duration;
    };
    trackEl.addEventListener("click", (e) => seek(e.clientX));
    trackEl.addEventListener("keydown", (e) => {
        const k = e.key;
        if (k === "ArrowLeft") {
            audio.currentTime = Math.max(0, audio.currentTime - 5);
            e.preventDefault();
        } else if (k === "ArrowRight") {
            audio.currentTime = Math.min(
                isFinite(audio.duration) ? audio.duration : 0,
                audio.currentTime + 5,
            );
            e.preventDefault();
        } else if (k === " " || k === "Enter") {
            togglePlay();
            e.preventDefault();
        }
    });

    window.addEventListener("beforeunload", persist);
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") persist();
    });
}

async function loadPlaylist() {
    if (!PLAYLIST_URL) {
        showError("Error al cargar la playlist");
        return;
    }
    const res = await fetch(PLAYLIST_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.songs || !Array.isArray(data.songs) || data.songs.length === 0) {
        throw new Error("La playlist no tiene canciones");
    }
    state.playlist = data;
    state.queue = data.songs.map((_, i) => i);
}

async function init() {
    if (!document.getElementById("mp-play")) return;

    bindEvents();

    if (state.playlist && state.queue.length > 0) {
        applyStateToDOM();
        loadSong(state.cursor);
        return;
    }

    try {
        await loadPlaylist();
        hideError();
        restorePersistedState();
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Error desconocido";
        console.error("MusicPlayer:", e);
        showError(`No se pudo cargar la playlist: ${msg}`);
    }
}

document.addEventListener("astro:page-load", init);
