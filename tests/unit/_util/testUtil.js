import { jest } from "@jest/globals";
import { Readable, Writable } from "stream";

/**
 * This class is an auxiliar that allows test the request and response objects
 *  for example: to test we need a pipe function that is available in stream objects
 * 
 */
export default class TestUtil {

    static generateReadableStream(data) {
        return new Readable({
            read() {
                for (const item of data) {
                    this.push(item);
                }

                this.push(null);
            }
        });
    }

    // onData is used to passthrough a jest mock function
    static generateWritableStream(onData) {
        return new Writable({
            write(chunk, enc, cb) {
                onData(chunk);

                cb(null, chunk);
            }
        });
    }

    static defaultHandleParams() {
        const requestStreamMock = TestUtil.generateReadableStream([]);
        const responseStreamMock = TestUtil.generateWritableStream(() => {});

        const data = {
            req: Object.assign(requestStreamMock, {
                headers: {},
                method: '',
                url: ''
            }),
            res: Object.assign(responseStreamMock, {
                writeHead: jest.fn(),
                end: jest.fn()
            })
        }

        return {
            values: () => Object.values(data),
            ...data
        };
    }
}