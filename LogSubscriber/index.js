// Imports the Google Cloud client library
const BigQuery = require('@google-cloud/bigquery');

// Your Google Cloud Platform project ID
const projectId = 'sixth-hawk-194719';

// Creates a client
const bigquery = new BigQuery({
    projectId: projectId,
});
exports.logSubscriber = (event, callback) => {

    console.log('event -- ', event);
    const pubsubMessage = event.data;
    console.log('Log subscriber');
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

    const datasetId = "box_skills";
    const tableId = "file";
    var date = new Date();
    const datetime = BigQuery.datetime({
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDay(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
    });

    const rows = [{ file_id: fileId, file_name: fileName, read_token: readToken, write_token: writeToken, created: datetime, updated: datetime }];

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
