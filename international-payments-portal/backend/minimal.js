// minimal.js
console.log('STARTING...');

const http = require('http');

const server = http.createServer((req, res) => {
    console.log('Request:', req.method, req.url);
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.url === '/api/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Working!' }));
        return;
    }
    
    if (req.url === '/api/payments' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            console.log('Payment data:', body);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: 'DEMO: 1 payment submitted to SWIFT!',
                transactionId: 'SWIFT_' + Date.now()
            }));
        });
        return;
    }
    
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3001, '0.0.0.0', () => {
    console.log('🎉 MINIMAL SERVER RUNNING ON http://localhost:3001');
    console.log('✅ This cannot fail!');
});

console.log('Server setup complete - waiting for connections...');