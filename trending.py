from pyspark import SparkConf
from pyspark.sql import SparkSession
from pyspark.sql.functions import round


DB_URI = "mongodb+srv://nikhil:nikhil@shazamdb-ci1rz.mongodb.net/"

spark = SparkSession.builder.appName("Trending"). \
    config("spark.mongodb.output.uri", DB_URI + "movie_analysis.trending_movies"). \
    getOrCreate()

# This is for trending movies
df_movies = spark.read.format("com.mongodb.spark.sql.DefaultSource").option(
    "uri", DB_URI + "movie_analysis.movies").load()
df_movie_user = spark.read.format("com.mongodb.spark.sql.DefaultSource").option(
    "uri", DB_URI + "movie_analysis.movie_user_matchings").load()
df_movies.createOrReplaceTempView("movies")
df_movie_user.createOrReplaceTempView("movie_user_matchings")

movies = spark.sql("SELECT movies.movie_id as movie_id, COUNT(movies.movie_id) as views FROM movies "
                   "INNER JOIN movie_user_matchings on movies.movie_id=movie_user_matchings.movie_id "
                   "WHERE  movie_user_matchings.timestamp >= date_add(current_date(), -7)"
                   "GROUP BY movies.movie_id ORDER BY views DESC")
movies.show()
movies.write.format("com.mongodb.spark.sql.DefaultSource").mode(
    "overwrite").save()

# This is for top rated movies
df_ratings = spark.read.format("com.mongodb.spark.sql.DefaultSource").option(
    "uri", DB_URI + "movie_analysis.ratings").load()

avg_ratings = df_ratings.groupBy("movie_id").avg(
    "rating").orderBy("avg(rating)", ascending=False)
avg_ratings = avg_ratings.select(avg_ratings["movie_id"], round(
    avg_ratings["avg(rating)"], 1).alias("avg_rating"))
print("avg_rating=======================", avg_ratings)
print("printschema====================")
avg_ratings.printSchema()
avg_ratings.write.format("com.mongodb.spark.sql.DefaultSource").option(
    "uri", DB_URI + "movie_analysis.top_rated_movies").mode("overwrite").save()
avg_ratings.printSchema()
avg_ratings.show()
