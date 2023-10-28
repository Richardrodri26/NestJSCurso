import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Server
  
  constructor(
      private readonly messagesWsService: MessagesWsService,
      private readonly jwtService: JwtService
    ) {}


  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token)
      await this.messagesWsService.registerClient(client, payload.id)

    } catch (error) {
      client.disconnect()
      return
    }

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())

  }
  handleDisconnect(client: Socket) {
    // console.log("client disconneted", client.id)
    this.messagesWsService.removeClient(client.id)

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  // message-from-client

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    // messages-from-server

    //! Esto emite solo al cliente
    // client.emit('messages-from-server', {
    //   fullName: 'asdasdas',
    //   message: payload.message || 'no-message'
    // })

    //! Emitir a todos menos al cliente inicial
    //  client.broadcast.emit('messages-from-server', {
    //   fullName: 'asdasdas',
    //   message: payload.message || 'no-message'
    // })

    this.wss.emit('messages-from-server', {
        fullName:this.messagesWsService.getUserFull(client.id),
        message: payload.message || 'no-message'
      })

  }


}
