import { UAParser } from "ua-parser-js";
import * as WebSocket from 'ws';

export class Peer {

    private readonly socket: WebSocket;
    private data: {
        model: string,
        os: string,
        browser: string,
        type: number,
        ip: string
    };
    private id: string;
    private ip: string;
    private readonly rtcSupported: boolean = false;

    public timerId;
    public lastBeat: number;

    constructor(socket: WebSocket, request) {
        this.socket = socket;
        this.setIP(request)
        this.setId(request);
        this.rtcSupported = request.url.indexOf('webrtc') > -1;
        this.setName(request);

        this.timerId = 0;
        this.lastBeat = Date.now();
    }

    public getSocket(): WebSocket {
        return this.socket;
    }

    setIP(request): void {
        if (request.headers['x-forwarded-for']) {
            this.ip = request.headers['x-forwarded-for'].split(/\s*, \s*/)[0];
        } else {
            this.ip = request.connection.remoteAddress;
        }

        if (this.ip == '::1' || this.ip == '::ffff:127.0.0.1') {
            this.ip = '127.0.0.1';
        }
    }

    getIP(): string {
        return this.ip;
    }

    setId(request): void {
        if (request.peerId) {
            this.id = request.peerId;
        } else {
            this.id = request.headers.cookie.replace('peerid=', '');
        }
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
            ip: this.ip
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

    getInfo(): {} {
        return {
            id: this.id,
            data: this.data,
            rtcSupported: this.rtcSupported
        }
    }
}
