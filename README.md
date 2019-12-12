sam package --template-file template.yml --s3-bucket shazam-sam-templates --output-template-file output-template.yml 
sam deploy --template-file output-template.yml --stack-name shazam --capabilities CAPABILITY_IAM 
sam delete-stack --stack-name shazam