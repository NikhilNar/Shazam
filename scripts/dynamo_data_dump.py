from __future__ import print_function  # Python 2/3 compatibility
import boto3
import json
import decimal
import requests
from requests_aws4auth import AWS4Auth
from datetime import datetime

dynamodb = boto3.resource('dynamodb', region_name='us-east-1',
                          endpoint_url="http://dynamodb.us-east-1.amazonaws.com")


#  DynamoDB fields : Business ID, Name, Address, Coordinates, Number of Reviews, Rating, Zip Code
def loadData(tableName, fileName):
    table = dynamodb.Table(tableName)
    with open(fileName, encoding="utf8") as json_file:
        jsonValues = json.load(json_file, parse_float=decimal.Decimal)
        for jsonValue in jsonValues:
            table.put_item(
                Item=jsonValue)


#loadData('movies', '../dataset/movies.json')
#loadData('movie-user-matchings', '../dataset/movie_user_matchings.json')
loadData('ratings', '../dataset/ratings.json')
#loadData('top-rated-movies', '../dataset/top_rated_movies.json')
#loadData('trending-movies', '../dataset/trending_movies.json')
#loadData('users', '../dataset/users.json')
