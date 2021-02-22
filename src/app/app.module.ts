import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { WebexComponent } from './webex/webex.component';
import { DialogComponent } from './dialog/dialog.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RoomsComponent } from './rooms/rooms.component';
import { FormsModule } from '@angular/forms';
import { MessagesComponent } from './messages/messages.component';
import { RouterModule, Routes } from '@angular/router';
import { AddParticipantComponent } from './add-participant/add-participant.component';
import { CallComponent } from './call/call.component';
import { FilterPipe } from './filter.pipe';

const appRoutes: Routes = [
	// { path: '', redirectTo: 'login', pathMatch: 'full' },
	{
	  path: 'message',
	  component: MessagesComponent,
	//   canActivate: [MyGuard],
	},
	// { path: '**', redirectTo: 'login' },
  ];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WebexComponent,
    DialogComponent,
    SidebarComponent,
    RoomsComponent,
    MessagesComponent,
    AddParticipantComponent,
    CallComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	FormsModule,
	RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
