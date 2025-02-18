import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ImagesService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key   : this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async listImages(): Promise<string[]> {
    try {
      const result = await cloudinary.api.resources();
      const imageUrls = result.resources.map((resource) => resource.url);
      return imageUrls;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getImage(publicId: string): Promise<string> {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result.url;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      // await cloudinary.api.delete_resources([publicId]);
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
