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
    private id: string;
    private ip: string;

    constructor(request) {
        this.setIP(request)
        this.setId();
        this.setName(request);
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

    setId(): void {
        this.id = uuid();
    }

    getId(): string {
        return this.id;
    }

    setName(request: Request): void {
        const ua = new UAParser(request.headers['user-agent']);
        this.data = {
            model: ua.getDevice().model,
            os: ua.getOS().name,
            browser: ua.getBrowser().name,
            type: this.getType(ua.getDevice().type),
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
