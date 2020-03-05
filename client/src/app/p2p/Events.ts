export class Events {
  static fire(type, customDetail) {
    window.dispatchEvent(new CustomEvent(type, { detail: customDetail }));
  }

  static on(type, callback) {
    return window.addEventListener(type, callback, false);
  }
}
