const PubSub = require(`@google-cloud/pubsub`);

module.exports = function boxSkills(req, res) {
    var fileName = req.body.source.name;
    var fileId = req.body.source.id;
    var readToken = req.body.token.read.access_token;
    var writeToken = req.body.token.write.access_token;
    console.log(fileName);

    /*
    if (true) {
        google.auth.getApplicationDefault(function(err, authClient, projectId) {
                if (err) {
                    throw err;
                }

                if (authClient.createScopedRequired && authClient.createScopedRequired()) {
                    authClient = authClient.createScoped([
                        'https://www.googleapis.com/auth/cloud-platform',
                        'https://www.googleapis.com/auth/userinfo.email'
                    ]);
                }
            }

        )
    }*/

    var filext = fileName.substring(fileName.indexOf("."))
    if (filext == ".jpg" || filext == ".jpeg" || filext == ".png" || filext == ".bmp" || filext == ".jpg_large") {
        console.log('Valid file ' + filext);
        var concatBuff = fileName + '-Skills-' + fileId + '-Skills-' + readToken + '-Skills-' + writeToken;
        console.log('Buff string', concatBuff);
        const dataBuffer = Buffer.from(concatBuff);
  //      publishMessage('box-skills-image-topic', dataBuffer);
  //      publishMessage('box-skills-clarifai-topic', dataBuffer);
            const pubsub = new PubSub();

    pubsub
        .topic('box-skills-image-topic')
        .publisher()
        .publish(dataBuffer)
        .then(results => {
            const messageId = results[0];
            console.log(`Message ${messageId} published.`);
        })
        .catch(err => {
            console.error('ERROR in publishing box-skills-image-topic:', err);
        });

            pubsub
        .topic('box-skills-clarifai-topic')
        .publisher()
        .publish(dataBuffer)
        .then(results => {
            const messageId = results[0];
            console.log(`Message ${messageId} published.`);
        })
        .catch(err => {
            console.error('ERROR in publishing box-skills-clarifai-topic:', err);
        });

    }
    else {
        console.log("Not a valid file extension. File extension must be csv json or xml");
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
