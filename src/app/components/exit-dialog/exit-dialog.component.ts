import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

export interface SelectOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-exit-dialog',
  templateUrl: './exit-dialog.component.html',
  styleUrl: './exit-dialog.component.scss',
  standalone: false,
})
export class ExitDialogComponent {
  @Input() navigate: string = "";

  @Output() close = new EventEmitter();

  constructor(
    private router: Router,
  ) {}

  onClickClose(): void {
    this.close.emit();
  }

  onClickMove(): void {
    this.router.navigate([this.navigate]);
  }
}
