import {
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { WebexService } from '../services/webex.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit {
  constructor(private webexService: WebexService) {}

  @Output() showModalEvent = new EventEmitter<boolean>();
  @Output() saveModalEvent = new EventEmitter<boolean>();

  showAlertMessage = false;
  showModal: boolean;
  roomName;
  addPeople;
  dialogMessage;
  loader = false;
  hasSpaceName = true;
  spaceCreated = false;

  ngOnInit() {}

  addRoom() {
    if (this.roomName) {
      this.loader = true;
      this.webexService
        .createRoom(this.roomName)
        .then((data) => {
          if (this.addPeople) {
            this.webexService
              .addMember(data.id, this.addPeople)
              .then((data) => {
                this.loader = false;
                this.roomName = '';
                this.showAlertMessage = true;
				this.spaceCreated = true;
                this.dialogMessage = 'Space created';
              })
              .catch((data) => {
                this.loader = false;
                this.roomName = '';
				this.spaceCreated = true;
                this.showAlertMessage = true;
                this.dialogMessage = 'Error occured while adding members';
              });
          } else {
            this.loader = false;
            this.roomName = '';
            this.showAlertMessage = true;
			this.spaceCreated = true;
            this.dialogMessage = 'Space created';
          }
        })
        .catch((data) => {
          this.loader = false;
          this.roomName = '';
          this.showAlertMessage = true;
          this.dialogMessage = 'Error occured while creating space';
        });
    } else {
      this.showAlertMessage = true;
      this.dialogMessage = 'Please enter space name';
    }
  }

  closeModal() {
    this.showModal = false;
    this.showModalEvent.emit(this.showModal);
    this.saveModalEvent.emit(this.spaceCreated);
  }

  okOrCancelDialogAction() {
    this.showAlertMessage = false;
    this.closeModal();
  }
}
