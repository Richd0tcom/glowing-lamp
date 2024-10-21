import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): Record<string, any> {
    return {
      appName: "Plaster API",
      version: 1.0
    }
  }
}
