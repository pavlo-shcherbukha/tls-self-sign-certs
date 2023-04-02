var fs = require('fs'); 
var https = require('https'); var options = { 
    hostname: 'localhost', 
    port: 443, 
    path: '/users', 
    method: 'GET', 
    headers: { 'client': 'client2' },
    ca: fs.readFileSync('ca-crt.pem'),
    cert: fs.readFileSync('client2-crt.pem'),
    key: fs.readFileSync('client2-key.pem')
}; var req = https.request(options, function(res) { 
    res.on('data', function(data) { 
        process.stdout.write(data); 
    }); 
}); req.end();