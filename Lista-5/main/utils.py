import boto3
import logging
from botocore.exceptions import ClientError
import os
import environ

env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)


def upload_file(file, bucket, object_name=None):
    """Upload a file to an S3 bucket

    :param file: File
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    # Upload the file+
    try:
        s3_connection = boto3.Session(
            aws_access_key_id=env("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=env("AWS_SECRET_ACCESS_KEY"),
            aws_session_token=env("AWS_SESSION_TOKEN"),
            region_name=env("AWS_REGION"),
        )
        s3 = s3_connection.resource("s3")
        s3.Bucket(bucket).put_object(Key=object_name, Body=file)
    except ClientError as e:
        logging.error(e)
        return False
    return True


def delete_file(bucket, object_name):
    """Delete a file from an S3 bucket

    :param bucket: Bucket to delete from
    :param object_name: S3 object name
    :return: True if the referenced object was deleted, otherwise False
    """

    # Delete the file
    s3_connection = boto3.Session(
        aws_access_key_id=env("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=env("AWS_SECRET_ACCESS_KEY"),
        aws_session_token=env("AWS_SESSION_TOKEN"),
        region_name=env("AWS_REGION"),
    )

    s3 = s3_connection.resource("s3")
    try:
        s3.Object(bucket, object_name).delete()
    except ClientError as e:
        logging.error(e)
        return False

    return True
