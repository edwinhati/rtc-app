import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  messages: Message[] = [
    {
      name: 'Admin',
      content: 'Welcome to the chat room',
    },
  ];
  client = {};

  createMessage(messageDto: Message, id: string) {
    const message = {
      name: this.client[id],
      content: messageDto.content,
    };
    this.messages.push(message);
    return message;
  }

  findAll() {
    return this.messages;
  }

  identify(name: string, id: string) {
    this.client[id] = name;
    return Object.values(this.client);
  }

  removeClient(id: string) {
    delete this.client[id];
  }

  getClientName(id: string) {
    return this.client[id];
  }

  getAllClient() {
    return this.client;
  }
}

export class Message {
  name: string;
  content: string;
}
