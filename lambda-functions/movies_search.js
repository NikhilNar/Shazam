'use strict';

var AWS = require('aws-sdk')

var region = 'us-east-1'; // e.g. us-west-1
var domain = 'search-movies-ghneqzlq3bkv2le36nceqyto5y.us-east-1.es.amazonaws.com'; // e.g. search-domain.region.es.amazonaws.com
var index = 'movie';
var type = 'list';

function searchDocuments(query) {
    return new Promise((resolve, reject) => {

        var client = new AWS.HttpClient();

        var endpoint = new AWS.Endpoint(domain);
        var request = new AWS.HttpRequest(endpoint, region);

        request.method = 'GET';
        request.path += index + '/' + type + '/_search?q=' + query;

        request.headers['host'] = domain;
        request.headers['Content-Type'] = 'application/json';
        // Content-Length is only needed for DELETE requests that include a request
        // body, but including it for all requests doesn't seem to hurt anything.
        request.headers['Content-Length'] = Buffer.byteLength(request.body);

        var credentials = new AWS.EnvironmentCredentials('AWS');
        var signer = new AWS.Signers.V4(request, 'es');
        signer.addAuthorization(credentials, new Date());
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
}

exports.handler = (event, context, callback) => {

    context.callbackWaitsForEmptyEventLoop = false;
    let query = event.queryStringParameters.query;

    searchDocuments(query)
        .then(data => {
            console.log("data======================================", data)
            // if (filter != "all") {
            //     data = data.filter(doc => {
            //         return doc.movie_collection != null
            //     }).map(doc => {
            //         return doc.movie_collection
            //     })
            // }
            let elsData = JSON.parse(data);
            let movieList = []

            elsData.hits.hits.forEach(data => {
                movieList.push(data["_source"]["title"])
            })

            let response = {
                "status": 200,
                "data": movieList
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