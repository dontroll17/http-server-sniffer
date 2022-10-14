import { IncomingMessage, Server, ServerResponse } from "http";
import { parse } from 'url';
import { inspect } from "util";
import { createWriteStream } from "fs";

const timestamp = () => {
    return new Date().toISOString();
}

const stream = createWriteStream(__dirname + '/log.log', {
    flags: 'w'
});


export const sniffOn = (server: Server) => {
    server.on('request', (req: IncomingMessage) => {
        stream.write(`${timestamp()} request`);
        stream.write(`${timestamp()} ${reqToString(req)}\n`);
    });

    server.on('close', (err: Error) => {
        stream.write(`${timestamp()} error: ${err}\n`);
    });

    server.on('checkContinue', (req: IncomingMessage, res: ServerResponse) => {
        stream.write(`${timestamp()} checkContinue`)
        stream.write(`${timestamp()} ${reqToString(req)}\n`);
        res.writeContinue();
    });

    server.on('upgrade', (req: IncomingMessage) => {
        stream.write(`${timestamp()} upgrade`);
        stream.write(`${timestamp()} ${reqToString(req)}\n`);
    });

    server.on('clientError', () => {
        stream.write('clientError\n');
    });
}

const reqToString = (req: IncomingMessage) => {
    let ret = `request ${req.method} ${req.httpVersion} ${req.url}\n`;
    
    if(req.url) {
        ret += JSON.stringify( parse(req.url) ) + '\n';
    }
    
    let keys = Object.keys(req.headers);

    for(let i = 0; i <keys.length; i++) {
        let key = keys[i];
        ret += `${i + 1} ${key}: ${req.headers[key]}\n`;
    }

    if(req.trailers) {
        ret += inspect(req.trailers) + '\n';
    }

    return ret;
}

