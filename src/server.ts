import { sniffOn } from "./sniffer";
import { createServer, IncomingMessage, ServerResponse } from "http";


const server = createServer();

server.on('request', (req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Done');
});

server.listen(3333, () => {
    console.log('blest-off on 3333');
});
sniffOn(server);