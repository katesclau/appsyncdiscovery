# AppSync Discovery

## Mapping Templates
https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-dynamodb.html

`$util` reference
https://docs.aws.amazon.com/appsync/latest/devguide/resolver-util-reference.html

## Testing templates with 
$util.error("Test Error", $util.toJson($ctx))

## Grabbing outputs from Cloudformation
You can use `serverless-manifest` plugin for it, along with `appsyncdiscovery\processManifest.js` to provide functions with the outputs.

## DynamoDB Mapping examples
https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-dynamodb.html#aws-appsync-resolver-mapping-template-reference-dynamodb-updateitem

## Presigned Urls POST vs PUT
https://medium.com/@zaccharles/s3-uploads-proxies-vs-presigned-urls-vs-presigned-posts-9661e2b37932

## References
https://www.simpleorientedarchitecture.com/test-strategy-for-continuous-delivery/
https://github.com/theburningmonk/appsyncmasterclass-backend
https://theburningmonk.thinkific.com/courses/take/appsync-masterclass-premium
https://lumigo.io
https://www.serverless.com/plugins/serverless-export-env
https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-dynamodb.html