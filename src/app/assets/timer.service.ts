import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { Timer } from './timer.interface';

@Injectable({ providedIn: 'root' })
export class TimerService {
  _timer: Timer = {
    seconds: 0,
    minutes: 0,
    hours: 0,
  };
  initTimer: Timer = {
    seconds: 0,
    minutes: 0,
    hours: 0,
  };

  dataTime = new BehaviorSubject<Timer>(this.initTimer);

  onStart(): void {
    this._timer.seconds++;
    if (this._timer.seconds > 59) {
      this._timer.minutes++;
      this._timer.seconds = 0;
    }
    if (this._timer.minutes > 59) {
      this._timer.hours++;
      this._timer.minutes = 0;
    }
    this.dataTime.next(this._timer);
  }

  onStop() {
    this._timer = {
      seconds: 0,
      minutes: 0,
      hours: 0,
    };
    this.dataTime.next(this.initTimer);
  }
}
