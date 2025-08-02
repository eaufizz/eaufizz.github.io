import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Player, ScoreAppService } from '../../core/service/ScoreAppService';
import GraphemeSplitter from 'grapheme-splitter';

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
  isDuplicate: boolean = false;
  isOver: boolean = false;

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
    this.isDuplicate = this.scoreAppService.isDuplicatePlayer(this.newName);
    if (this.getCustomLength(value) > 10) {
      this.isOver = true;
    } else {
      this.isOver = false;
    }
  }

  getCustomLength(value: string): number {
    const splitter = new GraphemeSplitter();
    const graphemes = splitter.splitGraphemes(value);
    return graphemes.reduce((sum, char) => {
      return sum + (char.match(/[ -~]/) ? 0.5 : 1);
    }, 0);
  }
}
