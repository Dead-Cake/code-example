import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

import { configS3 } from '../common/constants';
import { ConfigService } from '../common/config/config.service';

/**
 * S3 Service Class
 *
 * @class
 */
@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;
  /**
   * S3 Service.
   *
   * @param {ConfigService} configService config service
   */
  constructor (  private readonly configService: ConfigService
  ) {
    this.s3 = new AWS.S3(configS3);
    this.init();
  }

  /**
   * check that required buckets exists
   *
   */
  async init ():Promise<void> {
    const listBuckets = await this.s3.listBuckets().promise();
    if (!listBuckets.Buckets?.filter(b => b.Name === this.configService.bucketImageName).length) {
      await this.s3.createBucket({ Bucket: `${this.configService.bucketImageName}`, }).promise();
    }
  }

  /**
   * upload Image to S3
   *
   * @param {string} userId - uuid user id
   * @param {Buffer} file - upload file dto
   * @returns {string} - Image id
   */
  async uploadImage (userId: string, file: Buffer): Promise<string> {
    const imageId = uuidv4();
    const readStream = this.bufferToStream(file);
    await this.s3.upload({  Bucket: `${this.configService.bucketImageName}`,
      Key: `${userId}/${imageId}`, Body: readStream, }).promise();
    return imageId;
  }

  /**
   * parse buffer to stream
   *
   * @param {Buffer} buffer - file buffer
   * @returns {Readable} - stream
   */
  private bufferToStream (buffer: Buffer): Readable {
    const stream = new Readable();
    // eslint-disable-next-line no-console
    console.log(buffer);
    stream.push(buffer);
    stream.push(null);
    return stream;
  }
}
