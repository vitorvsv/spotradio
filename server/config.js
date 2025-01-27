import { fileURLToPath } from "url";
import { join, dirname } from "path";

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(currentDir, "../");

const publicDir = join(rootDir, "./public");
const audioDir = join(rootDir, "./audio");
const songsDir = join(audioDir, "./songs");
const fxDir = join(audioDir, "./fx");

export default {
    PORT: process.env.PORT || 3000,
    dir: {
        rootDir,
        publicDir,
        audioDir,
        songsDir,
        fxDir
    },
    pages: {
        homeHtml: "home/index.html",
        controllerHtml: "controller/index.html",
    },
    location: {
        home: "/home"
    },
    constants: {
        CONTENT_TYPE: {
            html: 'text/html',
            css: 'text/css',
            js: 'text/javascript'
        }
    },
}