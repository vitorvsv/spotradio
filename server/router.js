import { logger } from './util.js'

import config from './config.js';
import { Controller } from './controller.js';

const {
    location,
    pages: {
        homeHtml,
        controllerHtml
    },
} = config;

const controller = new Controller();

function getType(type) {    
    const types = {
        html: 'text/html',
    }

    type = type.toString().replace('.', '');
    
    return types[type] || '';
}

async function mapRoutes(req, res) {

    const { method, url } = req;

    if (url === '/' && method.toString().toLowerCase() === 'get') {
        res.writeHead(302, {
            'Location': location.home
        });

        return res.end();
    }

    if (url === '/home' && method.toString().toLowerCase() === 'get') {
        const {
            stream,
            type
        } = await controller.getFileStream(homeHtml);

        res.writeHead(200, {
            'Content-Type': getType(type)
        })

        return stream.pipe(res);
    }

    if (url === '/controller' && method.toString().toLowerCase() === 'get') {
        const {
            stream,
            type
        } = await controller.getFileStream(controllerHtml);

        res.writeHead(200, {
            'Content-Type': getType(type)
        })

        return stream.pipe(res);
    }

    // Get static files
    if (method.toString().toLowerCase() === 'get') {

        const {
            stream,
            type
        } = await controller.getFileStream(url);

        return stream.pipe(res);
    }

    res.writeHead(404);
    return res.end();
}

function handleError(error, res) {
    if (error.message.includes("ENOENT")) {
        logger.warn(`Não foi possível encontrar o asset ${error.stack}`);
        res.writeHead(404);
    } else {
        logger.error(`It was founded an error ${error.stack}`);
        res.writeHead(500);
    }

    return res.end();
}


export function router(req, res) {
    return mapRoutes(req, res)
            .catch(error => handleError(error, res) )
}