import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './gateway/socket/socket.gateway';
import { LamdaService } from '../service/lamda/lamda.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [SocketService,LamdaService, SocketGateway],
  exports: [SocketService, LamdaService],
})
export class SocketModule {}
