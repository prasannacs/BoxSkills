// Imports the Google Cloud client library
const BoxSDK = require('box-node-sdk');
const Request = require("request");
const PubSub = require(`@google-cloud/pubsub`);

exports.clarifaiVideoSubscriber = (event, callback) => {
    const pubsubMessage = event.data;
    console.log('Clarifai - Image subscriber');
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

    var sdk = new BoxSDK({
        clientID: 'foo',
        clientSecret: 'bar'
    });

    var labelTags = [];

    var boxFileURL = 'https://api.box.com/2.0/files/' + fileId + '/content?access_token=' + readToken;
    var clarifaiBody = { "inputs": [{ "data": { "image": { "url": boxFileURL } } }] }

    var options = {
        method: 'POST',
        json: clarifaiBody,
        url: 'https://api.clarifai.com/v2/models/aaa03c23b3724a16a56b629203edc62c/outputs',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Key c8472e1304c3471a802acd4d65a626ac'
        }
    }

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            let client = sdk.getBasicClient(writeToken);
            var labels = body.outputs[0].data.concepts;
            labels.forEach(label => labelTags.push({ 'text': label.name }))
            console.log('Labeltags -- ', labelTags);
            var transData = { fileId: fileId, fileName: fileName, tags: labels };
            console.log('Transmission data ', transData);
            const dataBuffer = Buffer.from(JSON.stringify(transData));
            publishMessage('box-skills-image-tag-topic', dataBuffer);

            // update metadata
            client.files.getMetadata(fileId, 'global', 'boxSkillsCards', function(error, cCard) {

                if (cCard != undefined) {

                    var updates = [{ "op": "add", "path": "/cards/-", "value": getSkillsCard(labelTags) }];
                    console.log('Skills card -- ', getSkillsCard(labelTags))

                    client.files.updateMetadata(fileId, 'global', "boxSkillsCards", updates)

                }
                else {
                    client.files.addMetadata(fileId, 'global', 'boxSkillsCards', getSkillsCardArray(labelTags), (error, res) => {
                        console.log('Skills cards array - clarifai ', getSkillsCardArray(labelTags));
                        if (error) {
                            console.log('Error in adding metadata ');
                        }
                        else {

                            res = {
                                statusCode: 200,
                                body: "Clarifai Skill Done"
                            }
                            console.log("skill updated");
                            return res;
                        }
                    });

                }
            })

        }
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
                console.error('ERROR in publishing tags to logger topic:', err);
            });

    }

    Request(options, callback);

    function getSkillsCardArray(tags) {
        // Create a  keyword metadata card
        var keywordsMetadata = {
            "cards": [getSkillsCard(tags)]
        }
        return keywordsMetadata;
    }

    function getSkillsCard(tags) {
        var updateSkillCard = {
            "type": "skill_card",
            "skill_card_type": "keyword",
            "skill": {
                "type": "service",
                "id": "box-skill-clarifai-label"
            },
            "invocation": {
                "type": "skill_invocation",
                "id": "5555"
            },
            "skill_card_title": {
                "message": "Clarifai Labels"
            },
            "entries": tags
        }
        return updateSkillCard;

    }


}
