import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { Player, ScoreAppService } from '../../core/service/ScoreAppService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-select-player',
  templateUrl: './select-player.component.html',
  styleUrl: './select-player.component.scss',
  standalone: false,
})
export class SelectPlayerComponent {
  private subscriptions = new Subscription();
  registeredPlayer: Player[] = [];
  showMenu: boolean = false;
  deleteTarget: Player | null = null;
  showDeletePlayerDialog: boolean = false;
  showChangeNameDialog: boolean = false;

  constructor(
    private router: Router,
    private scoreAppService: ScoreAppService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.scoreAppService.getRegisteredPlayer$().subscribe(
        (players) => {
          this.registeredPlayer = players;
        }
      )
    )
  }

  moveToHome(): void {
    this.router.navigate(['']);
  }

  toggleShowMenu(): void {
    this.showMenu = !this.showMenu;
  }

  changePlayerName(user: Player): void {

  }

  deletePlayer(user: Player): void {
    this.deleteTarget = user;
    this.showDeletePlayerDialog = true;
  }

  closeDeletePlayerDialog(): void {
    this.showDeletePlayerDialog = false;
  }
}
