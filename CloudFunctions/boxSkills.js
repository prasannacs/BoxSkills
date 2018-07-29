const PubSub = require(`@google-cloud/pubsub`);

// Your Google Cloud Platform project ID
const projectId = 'sixth-hawk-194719 ';

// Instantiates a client
const pubsubClient = new PubSub({
  projectId: projectId,
});

module.exports = function boxSkills(req, res) {
    var fileName = req.body.source.name;
    var fileId = req.body.source.id;
    var readToken = req.body.token.read.access_token;
    var writeToken = req.body.token.write.access_token;
    console.log(fileName);

    var filext = fileName.substring(fileName.indexOf("."))
    if (filext == ".jpg" || filext == ".jpeg" || filext == ".png" || filext == ".bmp" || filext == ".jpg_large") {
        console.log('Valid file ' + filext);
        var concatBuff = fileName + '-Skills-' + fileId + '-Skills-' + readToken + '-Skills-' + writeToken;
        console.log('Buff string', concatBuff);
        const dataBuffer = Buffer.from(concatBuff);
        publishMessage('box-skills-image-topic', dataBuffer);
        publishMessage('box-skills-clarifai-topic', dataBuffer);
    }
    else {
        console.log("Not a valid file extension. File extension must be csv json or xml");
    }

    res.send('Box Skills - Ack');
}

    function publishMessage(topicName, dataBuffer) {
        //const pubsub = new PubSub();

        pubsubClient
            .topic(topicName)
            .publisher()
            .publish(dataBuffer)
            .then(results => {
                const messageId = results[0];
                console.log(`Message ${messageId} published.`, topicName);
            })
            .catch(err => {
                console.error('ERROR in publishing file name:', err);
            });

    }

