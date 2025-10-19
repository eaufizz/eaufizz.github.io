import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-score-info',
  templateUrl: './score-info.component.html',
  styleUrl: './score-info.component.scss',
  standalone: false,
})
export class ScoreInfoComponent {
  @Output() close = new EventEmitter();

  onClickClose(): void {
    this.close.emit();
  }
}
