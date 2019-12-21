'use strict';

var AWS = require('aws-sdk')
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://nikhil:nikhil@shazamdb-ci1rz.mongodb.net/test?retryWrites=true&w=majority";

var region = 'us-east-1'; // e.g. us-west-1
var domain = 'search-movies-ghneqzlq3bkv2le36nceqyto5y.us-east-1.es.amazonaws.com'; // e.g. search-domain.region.es.amazonaws.com
var index = 'movie';
var type = 'list';

function indexDocuments(documents) {
    return new Promise((resolve, reject) => {

        var client = new AWS.HttpClient();
        let promises = []
        documents.forEach((movie) => {
            let elasticData = {
                "movie_id": movie.movie_id,
                "title": movie.title
            }
            var endpoint = new AWS.Endpoint(domain);
            var request = new AWS.HttpRequest(endpoint, region);

            request.method = 'POST';
            request.path += index + '/' + type;

            request.headers['host'] = domain;
            request.headers['Content-Type'] = 'application/json';
            // Content-Length is only needed for DELETE requests that include a request
            // body, but including it for all requests doesn't seem to hurt anything.
            request.headers['Content-Length'] = Buffer.byteLength(request.body);

            var credentials = new AWS.EnvironmentCredentials('AWS');
            var signer = new AWS.Signers.V4(request, 'es');
            signer.addAuthorization(credentials, new Date());
            request.body = JSON.stringify(elasticData);
            let promise = new Promise((resolve, reject) => {
                client.handleRequest(request, null, function (response) {
                    console.log(response.statusCode + ' ' + response.statusMessage);
                    var responseBody = '';
                    response.on('data', function (chunk) {
                        responseBody += chunk;
                    });
                    response.on('end', function (chunk) {
                        console.log('Response body: ' + responseBody);
                        resolve(responseBody)
                    });
                }, function (error) {
                    console.log('Error: ' + error);
                    reject(error)
                });
            })

            promises.push(promise);
        })

        Promise.all(promises)
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            })
    })
}


exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    let mongoClientPromise = new Promise((resolve, reject) => {
        client.connect(err => {
            if (err) {
                reject(err);
            }
            else {
                resolve(client);
            }
        });
    })

    mongoClientPromise.then(client => {
        return client.db("movie_analysis").collection("movies").aggregate([
            {
                $project: {
                    duration: { $divide: [{ $subtract: [new Date().toISOString(), "$timestamp"] }, 3600000] }
                }
            }]).toArray()
            .toArray()
    })
        .then(data => {
            return indexDocuments(data)
        })
        .then(data => {

            let response = {
                "status": 200,
                "data": []
            }

            console.log("response=", response);

            callback(null, {
                statusCode: 200,
                headers: {
                    "content-type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify(response)
            })
        })
        .catch(err => {
            console.log("err=", err)
            callback(null, {
                statusCode: 500,
                headers: {
                    "content-type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: {}
            })
        })
};