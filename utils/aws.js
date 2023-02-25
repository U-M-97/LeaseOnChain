const aws = require('aws-sdk')

const region = process.env.AWS_REGION
const bucketName = process.env.AWS_BUCKET_NAME
const accessKey = process.env.AWS_ACCESS_KEY
const secretKey = process.env.AWS_SECRET_KEY

const s3 = new aws.S3({
    region,
    accessKey,
    secretKey,
    signatureVersion: 'v4'
})

module.exports = {bucketName, s3}