import pymongo

import boto3
from botocore.exceptions import ClientError
import logging

SENDER = "Shazam Admin <surajgaikwadg@gmail.com>"
AWS_REGION = "us-east-1"
CHARSET = "UTF-8"
SUBJECT = "Trending movies"

DB_URI = "mongodb+srv://nikhil:nikhil@shazamdb-ci1rz.mongodb.net/test?retryWrites=true&w=majority"
DB_NAME = "movie_analysis"
COL_TRENDING = "trending"
COL_MOVIES = "movies"

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

HTML_OPEN = '<html><head>' \
            '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">' \
            '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js">' \
            '</script></head>' \
            '<div class="container"><div class="examples row" id="image-list">'
HTML_CLOSE = '</div></div></html>'


def get_trending():
    myclient = pymongo.MongoClient(DB_URI)
    mydb = myclient[DB_NAME]
    trending_collection = mydb[COL_TRENDING]
    movies_collection = mydb[COL_MOVIES]
    movie_ids = []
    for trending in trending_collection.find():
        movie_ids.append(trending['movie_id'])
    logger.debug("Trending movie IDS: {}".format(movie_ids))
    movies = []
    for movie_id in movie_ids:
        movie = movies_collection.find_one({'_id': movie_id})
        movies.append(movie)
    logger.debug("Trending movies: {}".format(movies))

    HTML = HTML_OPEN
    for one_movie in movies:
        HTML += '<div class="col-3 p-3"><div class="pb-2">'
        HTML += '<img id="box1" src=' + one_movie['posters'] + ' class=" display-image" /></div</div>'
    HTML += HTML_CLOSE

    return HTML

def handler(event, context):
    """
    Route the incoming request based on intent.
    The JSON body of the request is provided in the event slot.
    """
    logger.debug('Event received:{}'.format(event))
    html = get_trending()
    send_email(html)

def send_email(BODY_HTML):
    # Create a new SES resource and specify a region.
    client = boto3.client('ses', region_name=AWS_REGION)

    # Try to send the email.
    try:
        # Provide the contents of the email.
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    "surajgaikwadg@gmail.com",
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': BODY_HTML,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': SUBJECT,
                },
            },
            Source=SENDER,
        )
    # Display an error if something goes wrong.
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])