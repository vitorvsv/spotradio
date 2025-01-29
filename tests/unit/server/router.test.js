import { jest, describe, test, expect, beforeEach } from "@jest/globals";

import config from "../../../server/config.js";
import { router } from "../../../server/router.js";
import { Controller } from "../../../server/controller.js";
import TestUtil from "../_util/testUtil.js";

const {
    pages,
    location,
    constants: {
        CONTENT_TYPE
    }
} = config;

describe("#Router - test suite for API response", () => {
    
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });
    
    test("GET / - should redirect to home page", async () => {
        const params = TestUtil.defaultHandleParams();
        params.req.method = 'get';
        params.req.url = '/';
    
        await router(...params.values());

        expect(params.res.writeHead).toBeCalled();
        expect(params.res.writeHead).toBeCalledWith(302, {
            "Location": location.home
        });
        expect(params.res.end).toBeCalled();
    });

    test(`GET /home - should responde with file ${pages.homeHtml} stream`, async () => {
        const params = TestUtil.defaultHandleParams();
        params.req.method = 'get';
        params.req.url = '/home';
    
        const mockReadableStream = TestUtil.generateReadableStream([]);

        jest.spyOn(
            mockReadableStream,
            "pipe"
        ).mockReturnValue();

        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name
        ).mockResolvedValue({
            type: 'html',
            stream: mockReadableStream
        });

        const { type, stream } =  await Controller.prototype.getFileStream(pages.homeHtml);

        await router(...params.values());

        expect(params.res.writeHead).toBeCalledWith(200, {
            'Content-Type': CONTENT_TYPE[type]
        });

        expect(Controller.prototype.getFileStream).toBeCalledWith(pages.homeHtml);
        expect(stream.pipe).toBeCalledWith(params.res);        
    });


    test(`GET /controller - should responde with file ${pages.controllerHtml} stream`, async () => {
        const params = TestUtil.defaultHandleParams();
        params.req.method = 'get';
        params.req.url = '/controller';
    
        const mockReadableStream = TestUtil.generateReadableStream([]);

        jest.spyOn(
            mockReadableStream,
            "pipe"
        ).mockReturnValue();

        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name
        ).mockResolvedValue({
            type: 'html',
            stream: mockReadableStream
        });

        const { type, stream } =  await Controller.prototype.getFileStream(pages.homeHtml);

        await router(...params.values());

        expect(params.res.writeHead).toBeCalledWith(200, {
            'Content-Type': CONTENT_TYPE[type]
        });

        expect(Controller.prototype.getFileStream).toBeCalledWith(pages.homeHtml);
        expect(stream.pipe).toBeCalledWith(params.res);        
    });


    test("GET /index.html - should response with file stream", async () => {
        
        const filename = 'index.html';
        
        const params = TestUtil.defaultHandleParams();
        params.req.method = 'get';
        params.req.url = `/${filename}`;
    
        const mockReadableStream = TestUtil.generateReadableStream([]);

        jest.spyOn(
            mockReadableStream,
            "pipe"
        ).mockReturnValue();

        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name
        ).mockResolvedValue({
            type: 'html',
            stream: mockReadableStream
        });

        const { type, stream } =  await Controller.prototype.getFileStream(filename);

        await router(...params.values());

        expect(params.res.writeHead).toBeCalledWith(200, {
            'Content-Type': CONTENT_TYPE[type]
        });

        expect(Controller.prototype.getFileStream).toBeCalledWith(filename);
        expect(stream.pipe).toBeCalledWith(params.res);        
    });

    test("GET /file.ext - should response with file stream and empty Content-Type", async () => {
        const filename = 'file.ext';
        
        const params = TestUtil.defaultHandleParams();
        params.req.method = 'get';
        params.req.url = `/${filename}`;
    
        const mockReadableStream = TestUtil.generateReadableStream([]);

        jest.spyOn(
            mockReadableStream,
            "pipe"
        ).mockReturnValue();

        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name
        ).mockResolvedValue({
            stream: mockReadableStream
        });

        const { stream } =  await Controller.prototype.getFileStream(filename);

        await router(...params.values());

        expect(params.res.writeHead).toBeCalledWith(200, {
            'Content-Type': ''
        });

        expect(Controller.prototype.getFileStream).toBeCalledWith(filename);
        expect(stream.pipe).toBeCalledWith(params.res);        
    });

    test("GET /unknown - given an inexistent route it should response with 404", async () => {
        const params = TestUtil.defaultHandleParams();
        params.req.method = 'post';
        params.req.url = `/unknown`;

        await router(...params.values());

        expect(params.res.writeHead).toBeCalledWith(404);
        expect(params.res.end).toBeCalled();
    });


    describe("Exceptions", () => {
        
        test("given inexistent file it should response with 404", async () => {
            const params = TestUtil.defaultHandleParams();
            params.req.method = 'get';
            params.req.url = `/index.png`;
    
            jest.spyOn(
                Controller.prototype,
                Controller.prototype.getFileStream.name
            ).mockRejectedValue(new Error("Error: ENOENT"))

            await router(...params.values());
    
            expect(params.res.writeHead).toBeCalledWith(404);
            expect(params.res.end).toBeCalled();
        });

        test("given an error it should response with 500", async () => {
            const params = TestUtil.defaultHandleParams();
            params.req.method = 'get';
            params.req.url = `/index.png`;
    
            jest.spyOn(
                Controller.prototype,
                Controller.prototype.getFileStream.name
            ).mockRejectedValue(new Error("Error"))

            await router(...params.values());
    
            expect(params.res.writeHead).toBeCalledWith(500);
            expect(params.res.end).toBeCalled();
        });
    });
});
