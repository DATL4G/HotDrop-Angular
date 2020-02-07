import {Component, Injector, OnInit} from '@angular/core';
import {ServerConnection} from "../../p2p";

@Component({
  selector: 'app-main-site',
  templateUrl: './main-site.component.html',
  styleUrls: ['./main-site.component.scss']
})
export class MainSiteComponent implements OnInit {

  private serverConnection: ServerConnection;

  constructor(private injector: Injector) {
    this.serverConnection = this.injector.get(ServerConnection);
  }

  ngOnInit() {
  }

  connectServer(): void {
    this.serverConnection.connect();
  }

}
