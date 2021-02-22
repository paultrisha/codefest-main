import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { resolve } from 'url';
import { WebexService } from '../services/webex.service';
@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss'],
})
export class CallComponent implements OnInit {
  constructor(private webexService: WebexService) {
    this.sendAudio = true;
    this.sendVideo = true;
  }

  @ViewChild(NgForm) ngForm: NgForm;
  @Input() modalMessage;
  @Input() modalName;
  @Output() showModalEvent = new EventEmitter<boolean>();
  @ViewChild('video') private video: any;
  @ViewChild('audio') private audio: any;
  @ViewChild('remotevideo') private remotevideo: any;
  @ViewChild('remotescreen') private remoteScreen: any;
  @ViewChild('selfscreen') private selfScreen: any;

  showAlertMessage = false;
  showModal: boolean;
  meeting;
  dialogMessage;
  loader = false;
  hasSpaceName = true;
  spaceCreated = false;
  remoteShareStream;
  localShareStream;
  sendVideo: boolean;
  sendAudio: boolean;
  audioBtn = 'Mute';
  videoBtn = 'Video off';

  ngOnInit() {
    this.loader = true;
	// this.webexService.meetingDeregister();
	// console.log(this.webexService.isRegistered())
	this.webexService.meetingRegister().then((data) => {
		this.loader = false;
		this.callContact();
	  });
  }

  closeModal() {
    this.hangUp();
  }

  okOrCancelDialogAction() {
    this.showAlertMessage = false;
    //this.closeModal();
  }

  callContact() {
    this.webexService
      .singleDial(this.modalMessage)
      .then((meeting) => {
        this.meeting = meeting;
        this.bindMeetingEvents(meeting);
        return this.joinMeeting(meeting);
      })
      .catch((error) => {
        this.showAlertMessage = true;
        this.dialogMessage = 'Error occured while making call';
      });
  }

  bindMeetingEvents(meeting) {
    meeting.on('error', (err) => {
      this.showAlertMessage = true;
      this.dialogMessage = err;
    });

    meeting.on('media:ready', (media) => {
      if (!media) {
        return;
      }
      if (media.type === 'local') {
        const video = this.video.nativeElement;
        video.srcObject = media.stream;
      }
      if (media.type === 'remoteVideo') {
        const rvideo = this.remotevideo.nativeElement;
        rvideo.srcObject = media.stream;
      }
      if (media.type === 'remoteAudio') {
        const audio = this.audio.nativeElement;
        audio.srcObject = media.stream;
      }
      if (media.type === 'remoteShare') {
        const rsvideo = this.remoteScreen.nativeElement;
        rsvideo.srcObject = media.stream;
        this.remoteShareStream = media.stream;
      }
      if (media.type === 'localShare') {
        const lsvideo = this.selfScreen.nativeElement;
        lsvideo.srcObject = media.stream;
        this.localShareStream = media.stream;
      }
    });
    meeting.on('media:stopped', (media) => {
      if (media.type === 'local') {
        const video = this.video.nativeElement;
        video.srcObject = null;
      }
      if (media.type === 'remoteVideo') {
        const rvideo = this.remotevideo.nativeElement;
        rvideo.srcObject = null;
      }
      if (media.type === 'remoteAudio') {
        const audio = this.audio.nativeElement;
        audio.srcObject = null;
      }
      if (media.type === 'localShare') {
        const lvideo = this.selfScreen.nativeElement;
        lvideo.srcObject = null;
      }
      if (media.type === 'remoteShare') {
        const rvideo = this.remoteScreen.nativeElement;
        rvideo.srcObject = null;
      }
    });
    meeting.on('meeting:startedSharingRemote', () => {
      const rsvideo = this.remoteScreen.nativeElement;
      rsvideo.srcObject = this.remoteShareStream;
    });

    meeting.on('meeting:stoppedSharingRemote', () => {
      const rsvideo = this.remoteScreen.nativeElement;
      rsvideo.srcObject = null;
    });
    meeting.on('meeting:startedSharingLocal', () => {
      const lsvideo = this.selfScreen.nativeElement;
      lsvideo.srcObject = this.localShareStream;
    });
    meeting.on('meeting:stoppedSharingLocal', () => {
      const lsvideo = this.selfScreen.nativeElement;
      lsvideo.srcObject = null;
    });
  }

  joinMeeting(meeting) {
    return meeting.join().then(() => {
      const mediaSettings = {
        receiveVideo: true,
        receiveAudio: true,
        receiveShare: true,
        sendVideo: this.sendVideo,
        sendAudio: this.sendAudio,
        sendShare: false,
      };

      return meeting.getMediaStreams(mediaSettings).then((mediaStreams) => {
        const [localStream, localShare] = mediaStreams;
        meeting.addMedia({
          localShare,
          localStream,
          mediaSettings,
        });
      });
    });
  }

  hangUp() {
	if(this.meeting){
		this.meeting.leave();
	}  
    this.showModal = false;
    this.showModalEvent.emit(this.showModal);
  }

  startSharing() {
    if (this.meeting) {
      this.waitForMediaReady(this.meeting)
        .then(() => {
          console.info('SHARE-SCREEN: Sharing screen via `shareScreen()`');
          this.meeting
            .shareScreen()
            .then(() => {
              console.info(
                'SHARE-SCREEN: Screen successfully added to meeting.'
              );
            })
            .catch((e) => {
              this.showAlertMessage = true;
              this.dialogMessage = 'Unable to share screen';
              console.error(e);
            });
        })
        .catch((e) => {
          this.showAlertMessage = true;
          this.dialogMessage = 'Unable to share screen';
          console.error(e);
        });
    } else {
      this.showAlertMessage = true;
      this.dialogMessage = 'No active meeting available to share screen';
    }
  }

  stopSharing() {
    if (this.meeting) {
      this.waitForMediaReady(this.meeting)
        .then(() => {
			const lsvideo = this.selfScreen.nativeElement;
			lsvideo.srcObject = null;
          this.meeting.stopShare()
		  .then(() => {
			this.showAlertMessage = true;
            this.dialogMessage = 'Screen sharing stopped';
		  })
		  .catch((e) => {
            this.showAlertMessage = true;
            this.dialogMessage = 'No active screen sharing';
            console.error(e);
          });
        })
        .catch((e) => {
          this.showAlertMessage = true;
          this.dialogMessage = 'No active screen sharing';
          console.error(e);
        });
    } else {
      this.showAlertMessage = true;
      this.dialogMessage = 'No active meeting available to share screen';
    }
  }

  waitForMediaReady(meeting) {
    return new Promise<void>((resolve, reject) => {
      if (meeting.canUpdateMedia()) {
        resolve();
      } else {
        console.info(
          'SHARE-SCREEN: Unable to update media, pausing to retry...'
        );
        let retryAttempts = 0;

        const retryInterval = setInterval(() => {
          retryAttempts += 1;
          console.info('SHARE-SCREEN: Retry update media check');

          if (meeting.canUpdateMedia()) {
            console.info('SHARE-SCREEN: Able to update media, continuing');
            clearInterval(retryInterval);
            resolve();
          }
          // If we can't update our media after 15 seconds, something went wrong
          else if (retryAttempts > 15) {
            console.error(
              'SHARE-SCREEN: Unable to share screen, media was not able to update.'
            );
            clearInterval(retryInterval);
            reject();
          }
        }, 1000);
      }
    });
  }

  videocheckbox() {
    if (this.sendVideo && this.meeting) {
      this.sendVideo = false;
      this.meeting.muteVideo().then(() => {
        this.videoBtn = 'Start video';
      });
    } else if (!this.sendVideo && this.meeting) {
      this.sendVideo = true;
      this.meeting.unmuteVideo().then(() => {
        this.videoBtn = 'Stop video';
      });
    }
  }
  audiocheckbox() {
    if (this.sendAudio && this.meeting) {
      this.sendAudio = false;
      this.meeting.muteAudio().then(() => {
        this.audioBtn = 'Unmute';
      });
    } else if (!this.sendAudio && this.meeting) {
      this.sendAudio = true;
      this.meeting.unmuteAudio().then(() => {
        this.audioBtn = 'Mute';
      });
    }
	else {
		this.showAlertMessage = true;
        this.dialogMessage = 'No active meeting';
	}
  }
}
