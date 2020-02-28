export abstract class Peer {

  protected name: string;
  protected type: number;
  protected address: string = null;

  public getName(): string {
    return this.name;
  }

  public getType(): number {
    return this.type;
  }

  public getAddress(): string {
    return this.address;
  }

  get(): {} {
    return {
      name: this.name,
      type: this.type,
      address: this.address
    }
  }
}
