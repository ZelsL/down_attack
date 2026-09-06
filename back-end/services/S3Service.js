import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

export default class S3Service {
  constructor() {
    this.bucketName = process.env.AWS_BUCKET_NAME;
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  async uploadFile(key, body, contentType) {
    const uploadParams = {
      Bucket: this.bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    };
    try {
      const command = new PutObjectCommand(uploadParams);
      await this.s3Client.send(command);
      console.log(`File uploaded successfully. ${key}`);
      return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (err) {
      console.error("Error", err);
      throw err;
    }
  }
  async deleteFile(key) {
    const deleteParams = {
      Bucket: this.bucketName,
      Key: key,
    };
    try {
      const command = new DeleteObjectCommand(deleteParams);
      await this.s3Client.send(command);
      console.log(`File deleted successfully. ${key}`);
    } catch (err) {
      console.error("Error", err);
      throw err;
    }
  }
}
