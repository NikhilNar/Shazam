import pymongo

import boto3
from botocore.exceptions import ClientError
import logging

FULL_HTML = '<!DOCTYPE html> ' \
            '<html> ' \
            '<head> ' \
            '<meta name="viewport" content="width=device-width, initial-scale=1"> ' \
            '<style>' \
            '* {box-sizing: border-box;} ' \
            '.column {float: left; width: 33.33%;padding: 10px; height: 300px;} ' \
            '.row {margin-bottom: 24px;} ' \
            'p{margin-top: 0px !important; margin-bottom: 24px !important;}' \
            '.row:after {content: ""; display: table; clear: both;} ' \
            '</style> ' \
            '</head> ' \
            '<body> ' \
            '<h2>Hi, these are the current trending Movies</h2> ' \
            '{{REPLACE}}'\
            '</body> </html>'

SENDER = "Shazam Admin <surajgaikwadg@gmail.com>"
AWS_REGION = "us-east-1"
CHARSET = "UTF-8"
SUBJECT = "Hi, New Trending movies are here."

DB_URI = "mongodb+srv://nikhil:nikhil@shazamdb-ci1rz.mongodb.net/test?retryWrites=true&w=majority"
DB_NAME = "movie_analysis"
COL_TRENDING = "trending_movies"
COL_MOVIES = "movies"
COL_USERS = "users"

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def get_trending():
    myclient = pymongo.MongoClient(DB_URI)
    mydb = myclient[DB_NAME]
    logger.debug("My DB: {}".format(mydb))
    trending_collection = mydb[COL_TRENDING]
    movies_collection = mydb[COL_MOVIES]
    movie_ids = []
    for trending in trending_collection.find():
        movie_ids.append(trending['movie_id'])
    logger.debug("Trending movie IDS: {}".format(movie_ids))
    movies = []
    for movie_id in movie_ids:
        movie = movies_collection.find_one({'movie_id': movie_id})
        movies.append(movie)
    logger.debug("Trending movies: {}".format(movies))

    HTML = '<div class="row">'
    for one_movie in movies:
        HTML += '<div class ="column">'
        HTML += '<img src = "' + one_movie['posters'] + '"; alt = "' + one_movie['title'] + '">'
        HTML += '<p> ' + one_movie['title'] + '</p>'
        HTML += '</div>'
    HTML += '</div>'
    html_formatted = FULL_HTML.replace("{{REPLACE}}", HTML)
    logger.debug("HTML: {}".format(html_formatted))
    return html_formatted


def get_to_addresses():
    emails = []
    myclient = pymongo.MongoClient(DB_URI)
    mydb = myclient[DB_NAME]
    users_collection = mydb[COL_USERS]
    for user in users_collection.find():
        if user.get('email'):
            emails.append(user.get('email'))
    return emails


def handler(event, context):
    """
    Route the incoming request based on intent.
    The JSON body of the request is provided in the event slot.
    """
    logger.debug('Event received:{}'.format(event))
    html = get_trending()
    to_addresses = get_to_addresses()
    logger.debug('To addresses:{}'.format(to_addresses))
    send_email(html, to_addresses)

def send_email(BODY_HTML, to_addressess):
    # Create a new SES resource and specify a region.
    client = boto3.client('ses', region_name=AWS_REGION)

    # Try to send the email.
    try:
        # Provide the contents of the email.
        response = client.send_email(
            Destination={
                'ToAddresses': to_addressess,
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