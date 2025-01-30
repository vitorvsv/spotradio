import { jest, describe, test, expect, beforeEach } from "@jest/globals";;
import fs from 'fs';
import path, { extname } from 'path';
import fsPromises from 'fs/promises';

import { Service } from "../../../server/service.js";
import TestUtil from "../_util/testUtil.js";

describe("#Service - test suite for service", () => {

    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test("When called getFileInfo should return the file type and the filename", async () => {
        const filename = 'home/index.html';
        const filenameType = extname(filename).replace(".", "");
        const mockFullFilePath = `/home/tests/${filename}`;

        jest.spyOn(
            path,
            path.join.name
        ).mockReturnValue(mockFullFilePath);

        jest.spyOn(
            fsPromises,
            fsPromises.access.name
        ).mockResolvedValue(undefined);

        const service = new Service();

        const { type, name } = await service.getFileInfo(filename);

        expect(type).toStrictEqual(filenameType);
        expect(name).toStrictEqual(mockFullFilePath);
    });
    
    test("When called createFileStrem should return a file stream", () => {
        const filename = 'home/index.html';

        const mockReadableStream = TestUtil.generateReadableStream([]);

        jest.spyOn(
            fs,
            'createReadStream'
        ).mockReturnValue(mockReadableStream);

        const service = new Service();

        const stream = service.createFileStream(filename);

        expect(fs.createReadStream).toBeCalledWith(filename);
    });

    test("When called getFileStream should return a file stream + the file type", async () => {
        const filename = 'home/index.html';

        const mockFileType = extname(filename).replace(".", "");
        const mockFullFilePath = `/home/test/${filename}`

        jest.spyOn(
            Service.prototype,
            Service.prototype.getFileInfo.name
        ).mockResolvedValue({
            type: mockFileType,
            name: mockFullFilePath
        });

        const mockReadableStream = TestUtil.generateReadableStream([]);

        jest.spyOn(
            Service.prototype,
            Service.prototype.createFileStream.name
        ).mockReturnValue(mockReadableStream);

        const service = new Service();

        const { type } = await service.getFileStream(filename);
        
        expect(type).toStrictEqual("html");
        expect(Service.prototype.getFileInfo).toBeCalledWith(filename);
        expect(Service.prototype.createFileStream).toBeCalledWith(mockFullFilePath);
    });
});