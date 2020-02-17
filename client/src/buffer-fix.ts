(window as any).global = window;
global.Buffer = global.Buffer || require('buffer').Buffer;
(window as any).process = {
  version: '',
  nextTick(callback: Function, ...args): void {
    console.log('hello there');
  }
};
