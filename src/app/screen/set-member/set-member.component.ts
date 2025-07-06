import { Component } from '@angular/core';
import {
  ScoreAppService,
  Team,
  Player,
} from '../../core/service/ScoreAppService';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-set-member',
  templateUrl: './set-member.component.html',
  styleUrl: './set-member.component.scss',
  standalone: false,
})
export class SetMemberComponent {
  currentTeams: Team[] = [];
  teamCount: number = 0;
  showRegisterPage: boolean = false;
  registeredPlayer: Player[] = [];
  selectedID: string[] = [];
  private subscription = new Subscription();


  constructor(
    private scoreAppService: ScoreAppService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentTeams = this.scoreAppService.getSelectedTeams().slice();
    this.teamCount = this. scoreAppService.getTeamCount();
    if (this.teamCount === 0) {
      this.moveToBack();
    }
    if (this.currentTeams.length === 0) {
      for (let i = 0; i < this.teamCount; i++) {
        const team: Team = {
          name: `チーム${i + 1}`,
          member: [],
          number: i,
          score: 0,
          totalScore: 0,
          miss: 0,
        };
        this.currentTeams.push(team);
    }
    }

    this.subscription.add(
      this.scoreAppService.getRegisteredPlayer$().subscribe((playerList) => {
        this.registeredPlayer = playerList;
      })
    );

    this.subscription.add(
      this.scoreAppService.getSelectedTeams$().subscribe((teams: Team[]) => {
        this.selectedID = teams.flatMap(team => team.member.map(p => p.id));
      })
    );
  }

  goNext(): void {
    this.router.navigate(["/game"]);
  }

  moveToBack(): void {
    this.router.navigate(["select-team"]);
  }

  moveToHome(): void {
    this.router.navigate([""]);
  }

  onChangeMember(index: number, team: Team): void {
    this.currentTeams[index] = team;
    this.scoreAppService.setSelectedTeams(this.currentTeams);
    console.log(this.currentTeams);
  }

  playerName: string = "";
  isDuplicate: boolean = false;

  toggleShowRegisterPage(): void {
    this.showRegisterPage = !this.showRegisterPage;
  }

  onInputPlayerName(value: string): void {
    this.playerName = value;
    this.isDuplicate = this.scoreAppService.isDuplicatePlayer(this.playerName);
  }

  onClickAdd(): void {
    this.scoreAppService.registerNewPlayer(this.playerName);
  }

  startGame(): void {
    this.router.navigate(["game"]);
  }
}
