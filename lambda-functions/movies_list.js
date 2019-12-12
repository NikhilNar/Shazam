'use strict';

var AWS = require('aws-sdk')

exports.handler = (event, context, callback) => {
    let filter = event.queryStringParameters.filter,
        genre = event.queryStringParameters.genre,
        page = event.queryStringParameters.page,
        promise;


    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://nikhil:nikhil@shazamdb-ci1rz.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("movie_analysis").collection("users");
        // perform actions on the collection object
        console.log("collection======");
        console.log(collection);
        if (err) {
            console.log("Error occured while connecting mongodb");
            console.log(err);
        }
        client.close();
    });


    // switch (filter) {
    //     case "ratings": promise = TopRatedMoviesModel.find({})
    //         .select('movie_id')
    //         .populate({
    //             path: 'movie_collection',
    //             select: 'title youtube_id posters genres',
    //             match: {
    //                 genres: {
    //                     $regex: genre,
    //                     $options: 'i'
    //                 }
    //             }
    //         })
    //         break;
    //     case "trending": promise = TrendingMoviesModel.find({})
    //         .select('movie_id')
    //         .populate({
    //             path: 'movie_collection',
    //             select: 'title youtube_id posters genres',
    //             match: {
    //                 genres: {
    //                     $regex: genre,
    //                     $options: 'i'
    //                 }
    //             }
    //         })
    //         break;
    //     default: promise = MoviesModel.find({
    //         genres: {
    //             $regex: genre,
    //             $options: 'i'
    //         }
    //     })
    //         .select('movie_id title youtube_id posters genres')
    // }


    // promise
    //     .then(data => {
    //         if (filter != "all") {
    //             data = data.filter(doc => {
    //                 return doc.movie_collection != null
    //             }).map(doc => {
    //                 return doc.movie_collection
    //             })
    //         }

    //         let response = {
    //             "total_pages": Math.ceil(data.length / 10),
    //             "data": []
    //         }

    //         for (let i = page * 12 - 12; i < page * 12; i++) {
    //             if (data.length > i)
    //                 response.data.push(data[i])
    //             else break;
    //         }

    //         callback(null, {
    //             statusCode: 200,
    //             headers: {
    //                 "content-type": "application/json",
    //                 "Access-Control-Allow-Origin": "*"
    //             },
    //             body: JSON.stringify(response)
    //         })
    //     })
    //     .catch(err => {
    //         console.log("err======")
    //         console.log(err)
    //         callback(null, {
    //             statusCode: 500,
    //             headers: {
    //                 "content-type": "application/json",
    //                 "Access-Control-Allow-Origin": "*"
    //             },
    //             body: {}
    //         })
    //     })

    callback(null, {
        statusCode: 500,
        headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: {}
    })
    // let message = JSON.parse(event.body).message,
    //     userId = JSON.parse(event.body).userId,
    //     responseBody = {},
    //     statusCode = 200

    // let lexRunTime = new AWS.LexRuntime();
    // let params = {
    //     botAlias: 'reeco',
    //     botName: 'Reeco',
    //     inputText: message,
    //     userId: userId
    // }

    // let promise = new Promise((resolve, reject) => {
    //     lexRunTime.postText(params, function (err, data) {
    //         if (err) {
    //             console.log("err =", err)
    //             statusCode = 500
    //             responseBody.message = "Did not get a response from Lex"
    //             resolve(responseBody)
    //         }
    //         console.log("message received from Lex =", data)
    //         responseBody.message = data
    //         resolve(responseBody)
    //     })
    // })

    // promise.then((responseBody) => {
    // callback(null, {
    //     statusCode: statusCode,
    //     headers: {
    //         "content-type": "application/json",
    //         "Access-Control-Allow-Origin": "*"
    //     },
    //     body: JSON.stringify(responseBody)
    // })
    // })
};