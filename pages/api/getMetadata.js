import {bucketName, s3} from "../../utils/aws"

export default async function handler(req, res) {

    const split = req.query.uri.split("/")
    const key = split[split.length - 1]

    const params = ({
        Bucket: bucketName,
        Key: key,
    })
    
    s3.headObject(params, function(err, data) {
        if (err) {
            res.send(err, err.stack)
        } else {
            res.send(data.Metadata)
        }
    })
}