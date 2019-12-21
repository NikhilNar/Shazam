'use strict';

var AWS = require('aws-sdk')
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://nikhil:nikhil@shazamdb-ci1rz.mongodb.net/test?retryWrites=true&w=majority";

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    let filter = event.queryStringParameters.filter,
        genre = event.queryStringParameters.genre,
        page = event.queryStringParameters.page;

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
        switch (filter) {
            case "ratings": return client.db("movie_analysis").collection("top_rated_movies")
                .aggregate([{ $lookup: { from: 'movies', localField: 'movie_id', foreignField: 'movie_id', as: 'movie' } }, {
                    $match: {
                        $and: [{ "movie.genres": { $regex: genre, $options: "i" } }]
                    }
                }, { $unwind: '$movie' },
                {
                    $project: {
                        _id: "$movie._id",
                        movie_id: "$movie.movie_id",
                        title: "$movie.title",
                        genres: "$movie.genres",
                        youtube_id: "$movie.youtube_id",
                        posters: "$movie.posters"
                    }
                }]).toArray()
            case "trending": return client.db("movie_analysis").collection("trending_movies")
                .aggregate([{ $lookup: { from: 'movies', localField: 'movie_id', foreignField: 'movie_id', as: 'movie' } }, {
                    $match: {
                        $and: [{ "movie.genres": { $regex: genre, $options: "i" } }]
                    }
                }, { $unwind: '$movie' },
                {
                    $project: {
                        _id: "$movie._id",
                        movie_id: "$movie.movie_id",
                        title: "$movie.title",
                        genres: "$movie.genres",
                        youtube_id: "$movie.youtube_id",
                        posters: "$movie.posters"
                    }
                }]).toArray()
            default: return client.db("movie_analysis").collection("movies").find({
                genres: {
                    $regex: genre,
                    $options: 'i'
                }
            }, { movie_id: 1, title: 1, youtube_id: 1, posters: 1, genres: 1 })
                .toArray()
        }
    })
        .then(data => {
            console.log("data======================================", data.length)
            if (filter != "all") {
                data = data.filter(doc => {
                    return doc.movie_collection != null
                }).map(doc => {
                    return doc.movie_collection
                })
            }

            let response = {
                "status": 200,
                "total_pages": Math.ceil(data.length / 10),
                "data": []
            }

            for (let i = page * 12 - 12; i < page * 12; i++) {
                if (data.length > i)
                    response.data.push(data[i])
                else break;
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