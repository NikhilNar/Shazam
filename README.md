# Shazam

When anyone wants to watch a movie and doesn’t know what to watch, they would want to check the trailers of some trending movies around them or the top rated movies of all time. And sometimes, also rate a movie themselves. **Shazam** is an application that provides the best of both worlds. This application enables users to browse through trailers of top rated movies and trending movies, all in one place.


## Architecture

![CC-architecture](https://github.com/NikhilNar/Shazam/blob/master/images/shazam-architecture.png)

## Prototype

You can check the prototype for the application here:

https://chinmay609410.invisionapp.com/prototype/ck3uz6xaa004g6g01yvn0wr2h/play


## Commands to package and deploy SAM templates

sam package --template-file template.yml --s3-bucket shazam-sam-templates --output-template-file output-template.yml 
sam deploy --template-file output-template.yml --stack-name shazam --capabilities CAPABILITY_IAM 
sam delete-stack --stack-name shazam

## Screenshots

#### **Homescreen:**

![Homescreen](https://github.com/NikhilNar/Shazam/blob/master/images/2.png)

#### **Trailer thumbnail:**

![Trailer-thumbnail](https://github.com/NikhilNar/Shazam/blob/master/images/1.png)


## Dataset

For movies and ratings, we are using dataset from grouplens.org 'MovieLens 20M' dataset.<br> 
For youtube trailers, we will be using the grouplens.org MovieLens 20M Youtube Trailers dataset.<br> 
We will use a separate dataset from Kaggle to fetch movie posters.<br> 

The links for the datasets are given below:

https://grouplens.org/datasets/movielens/20m<br>
https://grouplens.org/datasets/movielens/20m-youtube<br>
https://www.kaggle.com/neha1703/movie-genre-from-its-poster

## Team

* [Nikhil Nar](https://github.com/NikhilNar)
* [Suraj Gaikwad](https://github.com/surajgovardhangaikwad)
* [Chinmay Wyawahare](https://github.com/gandalf1819)
