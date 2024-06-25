import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketService } from '../../socket.service';
import { Logger } from '@nestjs/common';
import { LamdaService } from 'src/module/service/lamda/lamda.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    transports: ['websocket'],
  },
})
export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(private socketService: SocketService, private lamdaService: LamdaService,) {}

  afterInit(server: Server) {
    Logger.log(`socket SERVER!!!`);
    this.socketService.setServer(server);
  }

  handleConnection() {
    Logger.log(`socket connected!!!`);
  }

  handleDisconnect() {
    Logger.log(`socket disconnected!!!`);
  }

  emitEvent(event: string, message: any) {
    this.server.emit(event, message);
  }

  @SubscribeMessage('generateTrade')
  onEvent(@MessageBody() data: any) {
    this.lamdaService.subscribeMasterSlaveDetail();
    this.server.emit('trade', { result: data });
  }
}
