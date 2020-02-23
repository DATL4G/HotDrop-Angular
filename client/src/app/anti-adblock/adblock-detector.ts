import IBlockUBlock from "iblock-ublock";

export class AdBlockDetector {

  constructor() { }

  public init(): void {
    const iBlockUBlock = new IBlockUBlock({
      onDetected(): void {
        console.log('Ads blocked');
      },
      onNotDetected(): void {
        console.log('Ads not blocked');
      }
    });

    iBlockUBlock.run();
  }
}
