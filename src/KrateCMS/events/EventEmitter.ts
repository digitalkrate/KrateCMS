import { EventEmitter as _EventEmitter } from "events";

class EventEmitter extends _EventEmitter {
  emitted: (string | symbol)[] = [];

  emitWait(event: string | symbol, ...args: any[]): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      const listeners = this.listeners(event);
      for (const listener of listeners) {
        await listener(...args);
      }
      resolve(...args);
    });
  }

  emitOnce(event: string): void {
    this.emitted.push(event);
    this.emit(event);
  }

  on(event: string | symbol, listener: (...args: any[]) => void): this {
    if (this.emitted.includes(event)) {
      void listener();
      return this;
    } else {
      return super.on(event, listener);
    }
  }
}

export default EventEmitter;
