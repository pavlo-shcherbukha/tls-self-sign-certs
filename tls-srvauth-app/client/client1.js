var fs = require('fs'); 
var https = require('https'); var options = { 
    hostname: 'localhost', 
    port: 443, 
    path: '/users', 
    method: 'GET', 
    ca: fs.readFileSync('ca-crt.pem') 
}; var req = https.request(options, function(res) { 
    res.on('data', function(data) { 
        process.stdout.write(data); 
    }); 
}); req.end();