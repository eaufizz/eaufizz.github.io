import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-start-game-dialog',
  templateUrl: './start-game-dialog.component.html',
  styleUrl: './start-game-dialog.component.scss',
  standalone: false,
})
export class StartGameDialogComponent {
  @Output() close = new EventEmitter();
  @Output() start = new EventEmitter();

  onClickClose(): void {
    this.close.emit();
  }

  onClickStart(): void {
    this.start.emit();
  }
}
