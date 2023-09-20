import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService, Message } from './app.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway {
  constructor(private readonly appService: AppService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() MessageDto: Message,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.appService.createMessage(MessageDto, client.id);
    this.server.emit('message', message);
    return message;
  }

  @SubscribeMessage('findAllMessage')
  findAll() {
    return this.appService.findAll();
  }
  @SubscribeMessage('join')
  handleConnect(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    return this.appService.identify(name, client.id);
  }
  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const name = await this.appService.getClientName(client.id);
    client.broadcast.emit('typing', { name, isTyping });
  }
}
