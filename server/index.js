import server from "./server.js";

import { logger } from "./util.js";

import config from './config.js';

const { PORT } = config;

server.listen(PORT).on("listening", () => logger.info(`Listening on ${PORT}`));