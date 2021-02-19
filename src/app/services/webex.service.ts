import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Webex from 'webex';

@Injectable({
  providedIn: 'root'
})
export class WebexService {

  constructor() { }

  webex;

  beforeLogin() {
    this.webex = Webex.init({
      config: {
        meetings: {
          deviceType: 'WEB',
        },
        credentials: {
          client_id: environment.CLIENTID,
          redirect_uri: environment.REDIRECTURL,
          scope: environment.SCOPE,
        },
        logger: {
          level: 'info',
        },
      },
    });
    this.listenForWebex();
  }

  onInit() {
    this.webex = Webex.init({
      config: {
        meetings: {
          deviceType: 'WEB',
        },
      },
      credentials: {
        access_token: localStorage.getItem('access_token'),
      },
    });
    this.listenForWebex();
  }

  async listenForWebex() {
    this.webex.once(`ready`, () => {
      if (this.webex.credentials.supertoken) {
        localStorage.setItem(
          'access_token',
          this.webex.credentials.supertoken.access_token
        );
      } else {
        this.webex.authorization.initiateLogin();
      }
    });
  }

  async getLoginUserDetail() {
    return this.webex.people.get('me');
  }

  logout() {
    this.webex.logout();
    localStorage.removeItem('access_token');
  }
}
