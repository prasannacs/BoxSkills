// Imports the Google Cloud client library
const BigQuery = require('@google-cloud/bigquery');

// Your Google Cloud Platform project ID
const projectId = 'sixth-hawk-194719';

// Creates a client
const bigquery = new BigQuery({
    projectId: projectId,
});
exports.imageLogSubscriber = (event, callback) => {

    const pubsubMessage = event.data;
    var tagArray = Buffer.from(pubsubMessage.data, 'base64').toString();
    console.log('Tags Array -- ', tagArray);
    tagArray = JSON.parse(tagArray);
    console.log('Tags -- ', tagArray.tags);


    var mlProvider;
    if (tagArray.tags[0].mid != undefined) {
        mlProvider = 'Google Vision';
    } 
    else if(tagArray.tags[0].id != undefined) {
        mlProvider = 'Clarifai';
    }
    else {
        console.log('Image subscriber log event data not conforming to any standard ', pubsubMessage);
        return;
    }
    console.log('ML Provider',mlProvider,' ', tagArray.tags[0].mid,' ', tagArray.tags[0].id);

    const datasetId = "box_skills";
    const tableId = "image_label_tags";
    var date = new Date();
    const datetime = BigQuery.datetime({
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDay(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
    });

    var rows = [];

    if( mlProvider == 'Google Vision')  {
    tagArray.tags.forEach(label => {
        rows.push({ file_id: tagArray.fileId, ml_provider: mlProvider, tag: label.description, score: label.score, created: datetime, updated: datetime });

    });
    } 
    if( mlProvider == 'Clarifai')  {
        // Clarifai
       tagArray.tags.forEach(label => {
        rows.push({ file_id: tagArray.fileId, ml_provider: mlProvider, tag: label.name, score: label.value, created: datetime, updated: datetime });

    });     
    }

    console.log("Rows to insert -- ",rows);
    // Inserts data into a table
    bigquery
        .dataset(datasetId)
        .table(tableId)
        .insert(rows)
        .then(() => {
            console.log(`Inserted ${rows.length} rows`);
        })
        .catch(err => {
            if (err && err.name === 'PartialFailureError') {
                if (err.errors && err.errors.length > 0) {
                    console.log('Insert errors:');
                    err.errors.forEach(err => console.error(err));
                }
            }
            else {
                console.error('ERROR:', err);
            }
        });


}
