import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { SocketService } from 'src/module/socket/socket.service';

@Injectable()
export class LamdaService {
  masterTradeDetail: any;
  connectionId: string = '';
  constructor(
    private readonly httpService: HttpService,
    private socketService: SocketService,
  ) {}

  getMasterSlaveDetail(): Observable<AxiosResponse<any>> {
    return this.httpService.get(
      'https://inxotu7aff3dn4ox5qi3z3mnji0ouqcp.lambda-url.ap-southeast-2.on.aws',
    );
  }

  getConnectionId(): Observable<AxiosResponse<any>> {
    return this.httpService.get(
      'https://mt4.mtapi.io/Connect?user=44712225&password=tfkp48&host=18.209.126.198&port=443',
    );
  }

  getTradeDetail(): Observable<AxiosResponse<any>> {
    return this.httpService.get(
      `https://mt4.mtapi.io/OrderSend?ID=${this.connectionId}&SYMBOL=${this.masterTradeDetail.SYMBOL}&OPERATION=${this.masterTradeDetail.OPERATION}&VOLUME=${this.masterTradeDetail.VOLUME}&TAKEPROFIT=${this.masterTradeDetail.TAKEPROFIT}&COMMENT=${this.masterTradeDetail.COMMENT}`,
    );
  }

  subscribeMasterSlaveDetail() {
    this.getMasterSlaveDetail().subscribe({
      next: (res) => {
        this.masterTradeDetail = res.data;
        this.socketService.emitEvent(
          'logger',
          'Get Master Trade... (Pinging Lambda Function)',
        );
        if (!this.connectionId) {
          this.fetchConnectionId();
        } else {
          this.fetchTradeDetail();
        }
      },
      error: (error) => {
        console.log('error: ', error);
      },
    });
  }

  fetchConnectionId() {
    this.getConnectionId().subscribe({
      next: (res) => {
        this.connectionId = res.data;
        this.fetchTradeDetail();
      },
      error: (error) => {
        console.log('error: ', error);
      },
    });
  }

  fetchTradeDetail() {
    this.socketService.emitEvent(
      'logger',
      'Replicating Master Trade...',
    );
    this.getTradeDetail().subscribe({
      next: (res) => {
        if (res.status === 201) {
          if (res.data.code === 'INVALID_TOKEN') {
            this.socketService.emitEvent('logger', 'Invalid Token');
            this.fetchConnectionId();
          } else if(res.data.code === 'TOO_MANY_ORDERS') {
            this.socketService.emitEvent('logger', res.data.message);
          }
          return;
        }
        this.socketService.emitEvent(
          'logger',
          'Successfully Replicated Master Trade...',
        );
        this.socketService.emitEvent('trade', res.data);
      },
      error: (error) => {
        console.log('error: ', error);
      },
    });
  }
}
