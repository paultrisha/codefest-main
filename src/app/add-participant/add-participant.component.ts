import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { WebexService } from '../services/webex.service';

@Component({
  selector: 'app-add-participant',
  templateUrl: './add-participant.component.html',
  styleUrls: ['./add-participant.component.scss'],
})
export class AddParticipantComponent implements OnInit {
  constructor(private webexService: WebexService) {}

  @ViewChild(NgForm) ngForm: NgForm;
  @Input() modalMessage;
  @Output() showModalEvent = new EventEmitter<boolean>();
  @Output() saveModalEvent = new EventEmitter<boolean>();

  showAlertMessage = false;
  showModal: boolean;
  people;
  dialogMessage;
  loader = false;
  hasSpaceName = true;
  spaceCreated = false;

  ngOnInit() {}

  addPeople(form: NgForm) {
    if (this.people && this.modalMessage) {
      this.loader = true;
      this.webexService
        .addMember(this.modalMessage, this.people)
        .then((data) => {
          this.loader = false;
          this.people = '';
          this.showAlertMessage = true;
          this.dialogMessage = 'Added participant to space';
        })
        .catch((data) => {
          if (
            data.message.includes(
              '1:1 conversation already has the maximum number of participants'
            )
          ) {
            this.loader = false;
            this.people = '';
            this.showAlertMessage = true;
            this.dialogMessage =
              'Conversation already has maximum number of participants';
          } else {
            this.loader = false;
            this.people = '';
            this.showAlertMessage = true;
            this.dialogMessage = 'Error occured while adding members';
          }
        });
    } else {
      this.showAlertMessage = true;
      this.dialogMessage = 'Please enter email id';
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
