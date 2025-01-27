import { createServer } from "http";

import { router } from "./router.js";

const server = createServer(router);

export default server;