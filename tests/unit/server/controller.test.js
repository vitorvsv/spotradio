import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import { extname } from 'path';

import { Controller } from "../../../server/controller.js";
import { Service } from "../../../server/service.js";
import TestUtil from "../_util/testUtil.js";


describe("#Controller - test suite for controller", () => {

    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    })

    test("When pass a filename to getFileStream need to return a stream of the file + correct type", async () => {
        const filename = 'home/index.html';
        const controller = new Controller();
        const filenameType = extname(filename).replace(".", "");

        const mockReadableStream = TestUtil.generateReadableStream(['ok']);

        jest.spyOn(
            Service.prototype,
            Service.prototype.getFileStream.name
        ).mockResolvedValue({
            type: filenameType,
            stream: mockReadableStream
        })

        const { stream, type } = await controller.getFileStream(filename);

        expect(type).toStrictEqual(filenameType);
        expect(Service.prototype.getFileStream).toBeCalledWith(filename);
        expect(JSON.stringify(stream)).toStrictEqual(JSON.stringify(mockReadableStream));
    });

})