export class Events {
  public static fire(type, details): void {
    window.dispatchEvent(new CustomEvent(type, { detail: details }));
  }

  public static on(type, callback): void {
    return window.addEventListener(type, callback, false);
  }
}
