import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3'
import { AWS_REGION,AWS_PUBLIC_KEY,AWS_SECRET_KEY,AWS_BUCKET} from './config.js'
import fs from 'fs'

import multer from 'multer';
import multerS3 from 'multer-s3'

const clientS3 = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
})


export const upload = multer({
    storage: multerS3({
        s3: clientS3,
        bucket: AWS_BUCKET,
        key: function(req,file,cb) {
            const uniqueName = Date.now().toString() + '-' + file.originalname;
            cb(null, uniqueName);
        }
    })
})


export async function uploadFile(file){
    const stream = fs.createWriteStream(file.tempFilePath) //tempfile...
    const uploadParams = {
        Bucket: AWS_BUCKET,
        Key: file.name,
        Body: stream
    }

    const command = new PutObjectCommand(uploadParams)
    const results = await client.send(command)
    console.log(results)
}