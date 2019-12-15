# Shazam

When anyone wants to watch a movie and doesn’t know what to watch, they would want to check the trailers of some trending movies around them or the top rated movies of all time. And sometimes, also rate a movie themselves. **Shazam** is an application that provides the best of both worlds. This application enables users to browse through trailers of top rated movies and trending movies, all in one place.

## Architecture

![CC-architecture](https://github.com/NikhilNar/Shazam/blob/master/architecture.png)




## Commands to package and deploy SAM templates

sam package --template-file template.yml --s3-bucket shazam-sam-templates --output-template-file output-template.yml 
sam deploy --template-file output-template.yml --stack-name shazam --capabilities CAPABILITY_IAM 
sam delete-stack --stack-name shazam

## Team

* [Nikhil Nar](https://github.com/NikhilNar)
* [Suraj Gaikwad](https://github.com/surajgovardhangaikwad)
* [Chinmay Wyawahare](https://github.com/gandalf1819)
