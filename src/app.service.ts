import { Injectable } from '@nestjs/common';
import { LamdaService } from './module/service/lamda/lamda.service';

@Injectable()
export class AppService {

  constructor(
    private lamdaService: LamdaService,
  ) {}

  getHello(): string {
    this.lamdaService.subscribeMasterSlaveDetail();
    return 'Hello World!';
  }
}
