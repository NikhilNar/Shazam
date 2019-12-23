# Shazam

When anyone wants to watch a movie and doesn’t know what to watch, they would want to check the trailers of some trending movies around them or the top rated movies of all time. Shazam is a web portal similar to Netflix where users can watch trailers of various movies. Users can also rate the youtube trailers. Users will be given a choice to watch the trending videos and highly rated movies through filters across genres. Shazam is deployed on AWS and comprises of various technologies like EC2, DynamoDB, ElasticSearch, Lambdas, SQS, Python, Node.js, PySpark.

## Architecture

![CC-architecture](https://github.com/NikhilNar/Shazam/blob/master/images/shazam-architecture.png)


## Commands to package and deploy SAM templates

sam package --template-file template.yml --s3-bucket shazam-sam-templates --output-template-file output-template.yml 
sam deploy --template-file output-template.yml --stack-name shazam --capabilities CAPABILITY_IAM 
sam delete-stack --stack-name shazam

## Command to run Spark job on EMR

spark-submit --master local[*] --conf "spark.mongodb.input.uri=mongodb+srv://nikhil:nikhil@shazamdb-ci1rz.mongodb.net/" --conf "spark.mongodb.output.uri=mongodb+srv://nikhil:nikhil@shazamdb-ci1rz.mongodb.net/" --packages org.mongodb.spark:mongo-spark-connector_2.11:2.4.0 trending.py 

## Screenshots

#### **Homescreen:**

![Homescreen](https://github.com/NikhilNar/Shazam/blob/master/images/2.png)

#### **Trailer thumbnail:**

![Trailer-thumbnail](https://github.com/NikhilNar/Shazam/blob/master/images/1.png)

You can check screens for the Shazam:

https://chinmay609410.invisionapp.com/prototype/ck3uz6xaa004g6g01yvn0wr2h/play

## Application

For demo of the application, visit the YouTube link:

https://www.youtube.com/watch?v=qJ7a99oaO8Y&t=6s


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
