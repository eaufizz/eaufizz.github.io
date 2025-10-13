import { Component, EventEmitter, Output } from '@angular/core';
import { Player, ScoreAppService } from '../../core/service/ScoreAppService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss',
  standalone: false,
})
export class PlayerListComponent {
  @Output() selected = new EventEmitter<string>();
  private subscriptions = new Subscription();
  registeredPlayer: Player[] = [];
  showMenu: boolean = false;
  deleteTarget: Player | null = null;
  changeTarget: Player | null = null;
  showDeletePlayerDialog: boolean = false;
  showChangeNameDialog: boolean = false;

  constructor(
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onClickPlayer(id: string): void {
    this.selected.emit(id);
  }

  toggleShowMenu(): void {
    this.showMenu = !this.showMenu;
  }

  changePlayerName(user: Player): void {
    this.changeTarget = user;
    this.showChangeNameDialog = true;
  }

  deletePlayer(user: Player): void {
    this.deleteTarget = user;
    this.showDeletePlayerDialog = true;
  }

  closeDeletePlayerDialog(): void {
    this.showDeletePlayerDialog = false;
  }

  closeChangePlayerNameDialog(): void {
    this.showChangeNameDialog = false;
  }
}
