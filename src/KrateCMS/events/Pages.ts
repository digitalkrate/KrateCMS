import { EventEmitter } from 'kratecms/events';

export namespace Pages {

  class _Public extends EventEmitter { }

  class _Admin extends EventEmitter { }

  export const Public = new _Public();
  export const Admin = new _Admin();

  export function on(event: string | symbol, cb: (...args: any[]) => void) {
    Public.on(event, cb);
    Admin.on(event, cb);
  }

  // export function emit(event: string | symbol, ...args: any[]) {
  //   Public.emit(event, ...args);
  //   Admin.emit(event, ...args);
  // }

}

export default Pages;
