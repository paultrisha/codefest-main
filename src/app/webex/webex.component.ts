import { Component, OnInit } from '@angular/core';
import { WebexService } from '../services/webex.service';

@Component({
  selector: 'app-webex',
  templateUrl: './webex.component.html',
  styleUrls: ['./webex.component.scss']
})
export class WebexComponent implements OnInit {

  constructor(
	private webexService: WebexService,
  ) { }

  ngOnInit() {
	this.webexService.beforeLogin();
  }
}
