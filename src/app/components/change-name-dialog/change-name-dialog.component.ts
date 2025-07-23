import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Player, ScoreAppService } from '../../core/service/ScoreAppService';

@Component({
  selector: 'app-change-name-dialog',
  templateUrl: './change-name-dialog.component.html',
  styleUrl: './change-name-dialog.component.scss',
  standalone: false,
})
export class ChangeNameDialogComponent {
  @Input() registeredPlayer: Player[] = [];
  @Input() targetPlayer: Player | null = null;

  @Output() close = new EventEmitter();

  initName: string = "";
  newName: string = "";

  constructor(
    private scoreAppService: ScoreAppService,
  ) {}

  ngOnInit(): void {
    if (this.targetPlayer) {
      this.initName = this.targetPlayer.name;
    }
  }

  onClickClose(): void {
    this.close.emit();
  }

  onClickChange(): void {
    const targetIndex = this.registeredPlayer.findIndex(
      (player) => player.id === this.targetPlayer?.id);
    if (targetIndex >= 0) {
      this.registeredPlayer[targetIndex].name = this.newName;
      this.scoreAppService.updateRegisteredPlayer(this.registeredPlayer);
    }
    this.onClickClose();
  }

  onValueChange(value: string): void {
    this.newName = value;
  }
}
