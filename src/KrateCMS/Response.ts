import { Response as _Response } from 'express';

export default class Response {

  private res: _Response;

  constructor(res: _Response) {
    this.res = res;

    return new Proxy(this, {
      get: (target, name, receiver) => {
        if(!target.hasOwnProperty(name)) return this.res[name];

        return Reflect.get(target, name, receiver);
      },
      apply: (target, receiver, args) => {
        if(typeof target[receiver] === 'function') return target[receiver](...args);

        return this.res[receiver](...args);
      },
      has: (target, prop) => {
        return (typeof target[prop] !== 'undefined' || typeof this.res[prop] !== 'undefined');
      }
    });
  }



}
