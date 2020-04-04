import { UAParser } from "ua-parser-js";
import { uuid } from 'uuidv4';

export class Peer {

    private data: {
        model: string,
        os: string,
        browser: string,
        type: number
    };
    private rtcSupported: boolean;
    private id: string = null;
    private ip: string;
    private lastPing: number;

    constructor(request) {
        this.setIP(request);
        this.parseName(request);
        this.rtcSupported = request.url.indexOf('webrtc') > -1;
    }

    setIP(request): void {
        if (request.headers['x-forwarded-for']) {
            this.ip = request.headers['x-forwarded-for'].split(/\s*, \s*/)[0];
        } else {
            this.ip = request.connection.remoteAddress;
        }

        if (this.ip.startsWith('::1')) {
            this.ip = this.cutIP('::1');
        } else if (this.ip.startsWith('::ffff:')) {
            this.ip = this.cutIP('::ffff:');
        }

        if (this.ip === null || this.ip === '') {
            this.ip = '127.0.0.1';
        }
    }

    private cutIP(param: string): string {
        return this.ip.substring(this.ip.indexOf(param) + param.length +1);
    }

    getIP(): string {
        return this.ip;
    }

    setId(id = null): void {
        if (id === undefined || id === null || id === '') {
            if (this.id === null) {
                this.id = uuid();
            }
        } else {
            this.id = id;
        }
    }

    getId(): string|null {
        return this.id;
    }

    getLastPing(): number {
        return this.lastPing;
    }

    setLastPing(lastPing: number): void {
        this.lastPing = lastPing;
    }

    parseName(request: Request): void {
        const ua = new UAParser(request.headers['user-agent']);
        this.data = {
            model: ua.getDevice().model,
            os: ua.getOS().name,
            browser: ua.getBrowser().name,
            type: this.getType(ua.getDevice().type),
        }
    }

    setName(name = null): void {
        this.data = {
            model: name,
            os: this.data.os,
            browser: this.data.browser,
            type: this.data.type
        }
    }

    private getType(type: string): number {
        switch (type) {
            case 'wearable':
                return 0;
            case 'mobile':
                return 1;
            case 'tablet':
                return 3;
            default:
                return 4;
        }
    }
}
