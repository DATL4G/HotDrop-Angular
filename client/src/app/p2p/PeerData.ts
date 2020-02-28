import { DeviceDetectorService, DeviceInfo } from "ngx-device-detector";
import { Peer } from "./Peer";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class PeerData extends Peer {
  private readonly deviceService: DeviceDetectorService;
  private deviceInfo: DeviceInfo;

  constructor(deviceService: DeviceDetectorService) {
    super();
    this.deviceService = deviceService;
    this.deviceInfo = deviceService.getDeviceInfo();
    this.name = this.deviceInfo.os +'-'+ this.deviceInfo.browser;
    this.type = this.checkType(deviceService);
    this.address = null;
  }

  public getDeviceService(): DeviceDetectorService {
    return this.deviceService;
  }

  public checkType(typeData): number {
    if (typeData instanceof DeviceDetectorService) {
      if (typeData.isDesktop()) return 4;
      else if (typeData.isTablet()) return 3;
      else if (typeData.isMobile()) return 1;
    }
    return 1;
  }
}
