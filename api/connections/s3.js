import { S3RequestPresigner, getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Hash } from "@aws-sdk/hash-node";
import { HttpRequest } from "@aws-sdk/protocol-http";

import fs from 'fs';
import moment from 'moment';

const opts = {
  region: process.env.S3_REGION || 'us-east-1',
  // // bucket: process.env.S3_BUCKET,
  sslEnabled: process.env.S3_SSL_ENABLED || true,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET
  }
};

if (process.env.S3_FORCE_PATH_STYLE) opts.s3ForcePathStyle = process.env.S3_FORCE_PATH_STYLE;
if (process.env.S3_SIGNATURE_VERSION) opts.signatureVersion = process.env.S3_SIGNATURE_VERSION;

const client = new S3Client({ ...opts });

const presigner = new S3RequestPresigner({
  ...opts,
  sha256: Hash.bind(null, "sha256"), // In Node.js
  //sha256: Sha256 // In browsers
});

setTimeout(async () => {
  const input = { Bucket: process.env.S3_BUCKET, MaxKeys: 1 }
  const command = new ListObjectsV2Command(input);
  const response = await client.send(command);
  console.log(response?.Contents?.length > 0 ? '✅  S3 OK' : '❌  S3 NOT OK')
}, 1000)

const getPresignedUrl = async (key) => {
  const input = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    // Expires: moment().add(15, 'minutes').toDate(),
    // ACL: 'public-read',
    Conditions: [{ bucket: process.env.S3_BUCKET }], // { acl: "public-read" }
  }
  const command = new PutObjectCommand(input);
  const url = await getSignedUrl(client, command, { expiresIn: 3600, Conditions: input.Conditions });

  // also get a read url 
  const readCommand = new GetObjectCommand(input);
  const signed = await getSignedUrl(client, readCommand, { expiresIn: 3600 });

  return { presigned: url, signed }
}

const getSignedURL = async (key) => {
  const input = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Expires: moment().add(15, 'minutes').toDate(),
    Conditions: [{ bucket: process.env.S3_BUCKET }]
  }
  const command = new GetObjectCommand(input);
  const url = await getSignedUrl(client, command, { expiresIn: 3600, Conditions: input.Conditions });
  return url
}

const fileExists = async (key) => {
  const input = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
  }
  const command = new GetObjectCommand(input);
  try {
    const res = await client.send(command)
    return true
  } catch (e) {
    return false
  }
}

const uploadToS3 = async (file, key, makePublic = false) => {
  let fileContent;
  let contentType;

  try {
    // If file is a string path to a local file
    if (typeof file === 'string' && fs.existsSync(file)) {
      fileContent = fs.readFileSync(file);
      // Detect mime type based on file extension
      contentType = getMimeType(file);
    }
    // If file is already a Buffer or Stream
    else {
      fileContent = file;
      contentType = getMimeType(key);
    }

    const input = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
      ACL: makePublic ? 'public-read' : 'private'
    }

    const command = new PutObjectCommand(input);
    await client.send(command);

    // If public, return the direct S3 URL
    if (makePublic) {
      return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`;
    }

    // If private, return a signed URL
    return await getSignedURL(key);
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
}

// Helper function to determine MIME type
const getMimeType = (filename) => {
  const extension = filename.toLowerCase().split('.').pop();
  const mimeTypes = {
    'txt': 'text/plain',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'mp3': 'audio/mpeg',
    'mp4': 'video/mp4',
    'wav': 'audio/wav',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'zip': 'application/zip',
    // Add more mime types as needed
  };

  return mimeTypes[extension] || 'application/octet-stream';
}

// setTimeout(async () => {
//   const signed = await getPresignedUrl('voice/test.mp3')
//   console.log(signed)
// }, 1000)

export default {
  s3Instance: client,
  getPresignedUrl,
  getSignedURL,
  fileExists,
  uploadToS3,
}