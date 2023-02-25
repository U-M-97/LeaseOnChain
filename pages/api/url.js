import {bucketName, s3} from "../../utils/aws"

export default async function handler(req, res) {

  const params = ({
    Bucket: bucketName,
    Key: `${Math.floor(Math.random() * 100000000000000000)}`,
    Expires: 120,
    Metadata: {
      "title": req.query.title,
      "description": req.query.description,
      "price": req.query.price
    }
  })

  const url = await s3.getSignedUrlPromise('putObject', params)
  res.send(url)
      
}
