import { TimerService } from './assets/timer.service';
import { Timer } from './assets/timer.interface';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  buffer,
  debounce,
  filter,
  fromEvent,
  interval,
  Subscription,
  takeWhile,
  timer,
} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private timerService: TimerService) {}

  time!: Timer;
  timerSub!: Subscription;
  isActive: boolean = false;
  pause: boolean = false;
  componentAlive: boolean = true;
  @ViewChild('reset') resetBtn!: ElementRef;

  ngOnInit(): void {
    this.timerService.dataTime.subscribe((data) => {
      this.time = data;
    });
  }

  ngAfterViewInit(): void {
    const clickSource = fromEvent(this.resetBtn.nativeElement, 'click');
    clickSource
      .pipe(
        buffer(clickSource.pipe(debounce(() => timer(300)))),
        filter((v) => v.length > 1),
        takeWhile(() => this.componentAlive)
      )
      .subscribe(() => {
        this.resetTimer();
      });
  }

  ngOnDestroy(): void {
    this.timerSub.unsubscribe();
    this.componentAlive = false;
  }

  startTimer(): void {
    this.isActive = true;
    const timer = interval(1000);
    this.timerSub = timer.subscribe(() => {
      this.timerService.onStart();
    });
  }

  stopTimer() {
    this.isActive = false;
    this.pause = false;
    this.timerSub.unsubscribe();
    this.timerService.onStop();
  }

  pauseTimer() {
    this.timerSub.unsubscribe();
    this.pause = true;
  }

  continueTimer() {
    const timer = interval(1000);
    this.timerSub = timer.subscribe(() => {
      this.timerService.onStart();
      this.pause = false;
    });
  }

  resetTimer() {
    this.timerService.onStop();
    this.timerSub.unsubscribe();
    this.pause = false;

    const timer = interval(1000);
    this.timerSub = timer.subscribe(() => {
      this.timerService.onStart();
    });
  }
}
