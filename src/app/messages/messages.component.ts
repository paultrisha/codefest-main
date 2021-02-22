import {
  Component,
	ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../models/message.model';
import { Room } from '../models/room.model';
import { WebexService } from '../services/webex.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private webexService: WebexService
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.ngOnInit();
    });
  }

  roomId;
  loader = false;
  messages: Message[] = [];
  message;
  name;
  type;
  showAlertMessage = false;
  dialogMessage;
  meeting;
  cancel: boolean = false;
  showCreateRoomModal = false;
  room: Room[] = [{ id: '1234', title: '', type: '' }];
  webexSpace = false;
  showCallModal = false;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  ngOnInit() {
    this.getMessages();
  }
  
  ngAfterViewChecked() {
	this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  getMessages() {
    this.roomId = this.activatedRoute.snapshot.params['roomId'];
    this.name = this.activatedRoute.snapshot.params['name'];
	this.type = this.activatedRoute.snapshot.params['type'];
    this.loader = true;
    this.messages = [];
    this.webexService
      .listMessage(this.roomId)
      .then((messages) => {
        let i = 0;
        for (const item of messages.items) {
          this.messages[i] = new Message();
          this.messages[i].personEmail = item.personEmail;
          this.messages[i].created = item.created;
          this.messages[i].text = item.text;
          i++;
        }
        this.loader = false;
      })
      .catch((error) => {
        this.loader = false;
      });
  }

  sendMessageToSpace() {
    this.roomId = this.activatedRoute.snapshot.params['roomId'];
    if (this.roomId && this.message) {
      this.loader = true;
      this.webexService
        .sendMessage(this.message, this.roomId)
        .then((data) => {
          this.loader = false;
          this.message = '';
          this.getMessages();
        })
        .catch((data) => {
          this.loader = false;
          this.message = '';
            this.showAlertMessage = true;
            this.dialogMessage = 'Error occurred while sending message'
        });
    } else {
      //   this.showAlertMessage = true;
      //   this.translate.get('NOMESSAGE').subscribe((value: any) => {
      //     this.dialogMessage = value;
      //   });
    }
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
		  this.room[i].type = item.type;
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

  addPeople() {
    this.showCreateRoomModal = true;
  }

  createModalReceiveMessage($event) {
    this.showCreateRoomModal = $event;
	this.roomId = this.roomId;
  }

  updateSpace($event) {
    if ($event) {
		//this.messages.concat( [{ personEmail: '1234',created : '', text: 'Added' }]);
    }
  }

  call(){
	this.showCallModal = true;
  }

  callModalReceiveMessage($event) {
    this.showCallModal = $event;
	this.roomId = this.roomId;
	this.name = this.name;
  }

  okDialogAction() {
    this.showAlertMessage = false;
  }
}
