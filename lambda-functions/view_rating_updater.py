import json
import logging
from datetime import datetime

import boto3
import pymongo

import dns

# Create SQS client
sqs = boto3.client('sqs')

QUEUE_NAME = "SQSViewsQueue"
DB_URI = "mongodb+srv://nikhil:nikhil@shazamdb-ci1rz.mongodb.net/test?retryWrites=true&w=majority"
DB_NAME = "movie_analysis"
COL_VIEWS = "movie_user_matchings"
COL_RATINGS = "ratings"

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


def process_messages(messages):
    view_list = []
    rating_list = []
    receipts = []
    dt_string = datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    for message in messages:
        logger.debug("Processing message %s", json.dumps(message))
        receipts.append(message['ReceiptHandle'])
        data = message["Body"]
        data_dict = json.loads(data)
        user_id = data_dict.get("user_id")
        movie_id = data_dict.get("movie_id")
        rating = data_dict.get("rating")

        # Update rating
        if rating:
            try:
                rating_float = float(rating)
            except ValueError:
                rating_float = 0.0
            rating_dict = {"user_id": user_id, "movie_id": movie_id, "rating": rating_float,
                           "timestamp": dt_string}
            rating_list.append(rating_dict)

        # Update views
        view_dict = {"user_id": user_id, "movie_id": movie_id, "timestamp": dt_string}
        view_list.append(view_dict)

    return view_list, rating_list, receipts


def update_views_db(views_list):
    if not views_list:
        logger.debug("Nothing in views list to update")
        return
    myclient = pymongo.MongoClient(DB_URI)
    mydb = myclient[DB_NAME]
    view_collection = mydb[COL_VIEWS]
    view_collection.insert_many(views_list)


def update_ratings_db(ratings_list):
    if not ratings_list:
        logger.debug("Nothing in ratings list to update")
        return
    myclient = pymongo.MongoClient(DB_URI)
    mydb = myclient[DB_NAME]
    rating_collection = mydb[COL_RATINGS]
    rating_collection.insert_many(ratings_list)


def get_sqs_messages_and_process():
    # Receive message from SQS queue
    queue_url = get_queue_url()
    response = sqs.receive_message(
        QueueUrl=queue_url,
        AttributeNames=[
            'SentTimestamp'
        ],
        MaxNumberOfMessages=10,
        MessageAttributeNames=[
            'All'
        ],
        VisibilityTimeout=30,
        WaitTimeSeconds=0
    )
    logger.debug("Response from SQS receive is %s", json.dumps(response))
    messages = response.get('Messages')
    if messages:
        views_list, ratings_list, receipts = process_messages(messages)
        update_views_db(views_list)
        update_ratings_db(ratings_list)
        for receipt in receipts:
            delete_message(queue_url, receipt)
    else:
        logger.debug("No messages to process")


def delete_message(queue_url, receipt_handle):
    # Delete a message given its receipt_handler
    logger.debug("Deleting message from queue: {} with handle: {}".format(queue_url, receipt_handle))
    sqs.delete_message(
        QueueUrl=queue_url,
        ReceiptHandle=receipt_handle
    )


def handler(event, context):
    """
    Route the incoming request based on intent.
    The JSON body of the request is provided in the event slot.
    """
    logger.debug('Event received:{}'.format(event))
    get_sqs_messages_and_process()


def get_queue_url():
    """Retrieve the URL for the configured queue name"""
    q = sqs.get_queue_url(QueueName=QUEUE_NAME).get('QueueUrl')
    logger.debug("Queue URL is %s", q)
    return q
