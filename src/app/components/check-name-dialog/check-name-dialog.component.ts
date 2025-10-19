import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

export interface SelectOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-check-name-dialog',
  templateUrl: './check-name-dialog.component.html',
  styleUrl: './check-name-dialog.component.scss',
  standalone: false,
})
export class CheckNameDialogComponent {
  @Input() playerName: string = "";

  @Output() close = new EventEmitter();
  @Output() agree = new EventEmitter();

  onClickClose(): void {
    this.close.emit();
  }

  onClickAgree(): void {
    this.agree.emit();
  }
}
