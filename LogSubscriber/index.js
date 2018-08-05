// Imports the Google Cloud client library
const BoxSDK = require('box-node-sdk');

exports.logSubscriber = (event, callback) => {
    
   const pubsubMessage = event.data;
    console.log('Log subscriber');
    var str = Buffer.from(pubsubMessage.data, 'base64').toString();
    console.log(str);
    
    
}
