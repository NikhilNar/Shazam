from __future__ import print_function  # Python 2/3 compatibility
import boto3
import json
import decimal
import requests
from requests_aws4auth import AWS4Auth
from datetime import datetime

# AWS ElasticSearch Endpoint
url = 'https://search-movies-ghneqzlq3bkv2le36nceqyto5y.us-east-1.es.amazonaws.com/movies/movies'


def send_signed(method, url, service='es', region='us-east-1', body=None):
    # print(body)

    credentials = boto3.Session().get_credentials()
    auth = AWS4Auth(credentials.access_key, credentials.secret_key,
                  region, service, session_token=credentials.token)

    fn = getattr(requests, method)
    if body and not body.endswith("\n"):
        body += "\n"
    fn(url, auth=auth, data=body,
       headers={"Content-Type":"application/json"})

movies_list = []
with open("movies.json") as json_file:
    movies = json.load(json_file)

    # iterate through each json object
    for row in movies:
        movie_id = row['movie_id']
        title = row['title']
        timestamp = row['timestamp']
    
        movies_els = {"id": movie_id, "title": title, "timestamp": timestamp}

        movies_list.append(dict(movies_els))
    
    print("Movie mapping completed!")
    # print(json.dumps(movies_list))

    i = 1
    for movie in movies_list:
        print(movie)
        send_signed('post', url, body=json.dumps(movie))
        i+=1
    
    print("Finn")



    


