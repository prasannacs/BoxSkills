const PubSub = require(`@google-cloud/pubsub`);

module.exports = function boxSkills(req, res) {
    var fileName = req.body.source.name;
    var fileId = req.body.source.id;
    var readToken = req.body.token.read.access_token;
    var writeToken = req.body.token.write.access_token;
    console.log(fileName);

    var filext = fileName.substring(fileName.indexOf("."))
    if (filext == ".jpg" || filext == ".jpeg" || filext == ".png" || filext == ".bmp" || filext == ".jpg_large" || filext == ".mp4" || filext == ".mpeg" || filext == ".pdf") {
        console.log('Valid file ' + filext);
        var concatBuff = fileName + '-Skills-' + fileId + '-Skills-' + readToken + '-Skills-' + writeToken;
        console.log('Buff string', concatBuff);
        const dataBuffer = Buffer.from(concatBuff);
        if( filext == ".jpg" || filext == ".jpeg" || filext == ".png" || filext == ".bmp" || filext == ".jpg_large" || filext == ".pdf")   {
             publishMessage('box-skills-image-topic', dataBuffer);
             publishMessage('box-skills-clarifai-topic', dataBuffer);
        }
        if( filext == ".mp4" || filext == ".mpeg" ) {
             publishMessage('box-skills-clarifai-video-topic', dataBuffer);
        }
    }
    else {
        console.log("Not a valid file extension. File extension must be jpg, jpeg, png, bmp, jpg_large or mp4, mpeg");
    }

    res.send('Box Skills - Ack');
}

function publishMessage(topicName, dataBuffer) {
    const pubsub = new PubSub();

    pubsub
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
