import { createReadStream } from 'fs';
import fsPromises from 'fs/promises';
import { join, extname } from 'path';

import config from './config.js';

const {
    dir: {
        publicDir
    }
} = config;

export class Service {

    createFileStream(filename) {
        return createReadStream(filename);
    }

    async getFileInfo(filename) {
        const fullFilePath = join(publicDir, filename);

        // try to access the file (to verify if it exists), in case of error throws an exception!
        await fsPromises.access(fullFilePath);

        const fileType = extname(fullFilePath);

        return {
            type: fileType,
            name: fullFilePath
        }
    }

    async getFileStream(filename) {
        const {
            name,
            type
        } = await this.getFileInfo(filename);

        return {
            stream: this.createFileStream(name),
            type
        }
    }

}