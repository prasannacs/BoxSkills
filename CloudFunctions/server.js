var express = require('express');
var app = express();

var hello = require('./hello.js');

app.get('/hello', hello);

app.listen(3000, function() {
    console.log('Listening...');
});
