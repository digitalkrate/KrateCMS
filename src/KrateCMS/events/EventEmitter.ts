import { EventEmitter as _EventEmitter } from "events";

class EventEmitter extends _EventEmitter {

  emitWait(event: string | symbol, ...args: any[]): Promise<any[]> {
    return new Promise(async(resolve, reject) => {
      const listeners = this.listeners(event);
      for(const listener of listeners) {
        await listener(...args);
      }
      resolve(...args);
    });
  }

}

export default EventEmitter;
