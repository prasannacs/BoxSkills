// Imports the Google Cloud client library
const BoxSDK = require('box-node-sdk');
const PubSub = require(`@google-cloud/pubsub`);

exports.logSubscriber = (event, callback) => {
    
    const pubsub = new PubSub();
    const subscriptionName = 'log-subscriber';


        const timeout = 60;

        // References an existing subscription
        const subscription = pubsub.subscription(subscriptionName);

        // Create an event handler to handle messages
        let messageCount = 0;
        const messageHandler = message => {
            console.log(`Received message ${message.id}:`);
            console.log(`\tData: ${message.data}`);
            console.log(`\tAttributes: ${message.attributes}`);
            messageCount += 1;

            // "Ack" (acknowledge receipt of) the message
            message.ack();
        };

        // Listen for new messages until timeout is hit
        subscription.on(`message`, messageHandler);
        setTimeout(() => {
            subscription.removeListener('message', messageHandler);
            console.log(`${messageCount} message(s) received.`);
        }, timeout * 1000);
    
    /*
    const pubsubMessage = event.data;
    console.log('Google Vision - Image subscriber');
    var str = Buffer.from(pubsubMessage.data, 'base64').toString();
    console.log(str);

    var fileName = str.slice(0, str.indexOf('-Skills-'));
    str = str.slice(fileName.length + 8, str.length);
    var fileId = str.slice(0, str.indexOf('-Skills-'));
    str = str.slice(fileId.length + 8, str.length);
    var readToken = str.slice(0, str.indexOf('-Skills-'));
    str = str.slice(readToken.length + 8, str.length);
    var writeToken = str;

    console.log('fileName -- ', fileName);
    console.log('fileId -- ', fileId);
    console.log('readToken -- ', readToken);
    console.log('writeToken -- ', writeToken);
    */

}
