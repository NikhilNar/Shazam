'use strict';

var AWS = require('aws-sdk')

exports.handler = (event, context, callback) => {
    let userId = JSON.parse(event.body).user_id,
        movieId = JSON.parse(event.body).movie_id,
        rating = JSON.parse(event.body).rating;

    let sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
    let messageBody = {
        "user_id": userId,
        "movie_id": movieId
    }

    if (rating) {
        messageBody["rating"] = rating
    }


    let params = {
        DelaySeconds: 10,
        MessageBody: JSON.stringify(messageBody),
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/586113678721/SQSViewsQueue"
    };

    sqs.sendMessage(params, function (err, data) {
        if (err) {
            console.log('ERR', err);
        }
        callback(null, {
            statusCode: 200,
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ status: 200, body: {} })
        })
        console.log(data);
    });
};