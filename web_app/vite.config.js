import { defineConfig } from "vite";

export default defineConfig({
    base: "/nba-teammate-web/",
    build: {
        outDir: "docs",
        rollupOptions: {
            input: {
                main: 'index.html',
                player_index: 'player_index.html',
                players: 'players.html',
            },
        },
    },
});