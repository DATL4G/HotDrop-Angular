import IBlockUBlock from "iblock-ublock";
import {MatDialog} from "@angular/material/dialog";
import {AdBlockDialog} from "../dialogs/adblock/adblock-dialog";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AdBlockDetector {

  constructor(public dialog: MatDialog) { }

  public init(): void {
    let self = this;
    const iBlockUBlock = new IBlockUBlock({
      onDetected(): void {
        self.dialog.open(AdBlockDialog);
      },
      onNotDetected(): void { }
    });

    iBlockUBlock.run();
  }
}
