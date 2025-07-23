import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Player, ScoreAppService } from '../../core/service/ScoreAppService';

export interface SelectOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-delete-player-dialog',
  templateUrl: './delete-player-dialog.component.html',
  styleUrl: './delete-player-dialog.component.scss',
  standalone: false,
})
export class DeletePlayerDialogComponent {
  @Input() registeredPlayer: Player[] = [];
  @Input() targetPlayer: Player | null = null;

  @Output() close = new EventEmitter();

  constructor(
    private scoreAppService: ScoreAppService,
  ) {}

  onClickClose(): void {
    this.close.emit();
  }

  onClickDelete(): void {
    const newPlayers = this.registeredPlayer.filter(
      (player) => player !== this.targetPlayer
    );
    this.scoreAppService.updateRegisteredPlayer(newPlayers);
    this.close.emit();
  }
}
