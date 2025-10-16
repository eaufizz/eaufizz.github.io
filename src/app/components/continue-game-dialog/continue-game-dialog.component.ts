import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-continue-game-dialog',
  templateUrl: './continue-game-dialog.component.html',
  styleUrl: './continue-game-dialog.component.scss',
  standalone: false,
})
export class ContinueGameDialogComponent {
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter();

  onClickClose(): void {
    this.close.emit();
  }

  onClickContinue(): void {
    this.continue.emit();
  }
}
