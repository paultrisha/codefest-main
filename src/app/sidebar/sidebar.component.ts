import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from '../models/room.model';
import { WebexService } from '../services/webex.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewChecked {

  constructor(
	private route: Router,
	private cdr: ChangeDetectorRef,
	private webexService : WebexService,
  ) {
   }

  userName: string;
  today: number = Date.now();
  showCreateRoomModal = false;
  showMessageSpace = false;
  selectedRoomId;
  webexSpace = false;
  loader = false;
  dialogMessage;
  showAlertMessage = false;
  searchText;
  
  room: Room[] = [];

  ngOnInit() {
	this.dialogMessage = 'Your contacts are on the left side !';
    this.showAlertMessage = true;
  }

  okOrCancelDialogAction() {
	this.loadContacts();
	this.showAlertMessage = false;
  }

  loadContacts() {
	this.loader = true;
	this.webexService
	.listRoom()
	.then((rooms) => {
	  let i = 0;
	  for (const item of rooms.items) {
		this.room[i] = new Room();
		this.room[i].title = item.title;
		this.room[i].id = item.id;
		i++;
	  }
	 // this.selectedRoomId = this.room[0].id;
	  this.loader = false;
	  this.webexSpace = true;
	})
	.catch((error) => {
	  this.loader = false;
	});
  }

  ngAfterViewChecked() {
    
      this.cdr.detectChanges();
  }

  createspace(){
	  this.showCreateRoomModal = true;
  }

  createModalReceiveMessage($event) {
	  this.showCreateRoomModal = $event;
  }

  updateRoom($event){
	  if($event){
		this.loadContacts();
	  }
  }

//   showMessage($event) {
// 	this.showMessageSpace = $event;
//   }

//   showMessages() {
// 	this.showMessageSpace = true;
//   }


}
