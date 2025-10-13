import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { Player } from '../../core/service/ScoreAppService';

@Component({
  selector: 'app-select-player',
  templateUrl: './select-player.component.html',
  styleUrl: './select-player.component.scss',
  standalone: false,
})
export class SelectPlayerComponent {
  registeredPlayer: Player[] = [];
  showMenu: boolean = false;
  deleteTarget: Player | null = null;
  changeTarget: Player | null = null;
  showDeletePlayerDialog: boolean = false;
  showChangeNameDialog: boolean = false;

  constructor(
    private router: Router,
  ) {}

  moveToHome(): void {
    this.router.navigate(['']);
  }

  onClickPlayer(id: string): void {
    this.router.navigate(["/view-data", id]);
  }
}
