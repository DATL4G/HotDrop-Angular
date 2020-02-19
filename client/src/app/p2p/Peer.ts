export abstract class Peer {

  protected name: string;
  protected type: number;
  protected address: string = null;

  get(): {} {
    return {
      name: this.name,
      type: this.type,
      address: this.address
    }
  }
}
