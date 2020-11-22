import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class EventEmiterService {

  dataStr = new EventEmitter();

  constructor() { }

  sendMessage() {
    this.dataStr.emit();
  }
}