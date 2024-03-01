import * as faker from 'faker'

export class MockS3Service {
  static image = faker.datatype.uuid();
  async uploadImage (userId: string, file: BufferSource): Promise<string> {
    return MockS3Service.image;
  }
}