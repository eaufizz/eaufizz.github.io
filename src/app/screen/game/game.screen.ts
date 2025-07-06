import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ScoreAppService,
  Team,
  Player,
} from '../../core/service/ScoreAppService';

@Component({
  selector: 'app-game',
  templateUrl: './game.screen.html',
  styleUrls: ['./game.screen.scss'],
  standalone: false,
})
export class GameComponent {
  teams: Team[] = [];
  teamString: string = "";
  activeTeam: Team = {
    name: "",
    member: [],
  };
  teamCount: number = 0;

  constructor(
    private appService: ScoreAppService,
  ) {}

  ngOnInit(): void {
    this.teams = this.appService.getSelectedTeams();
    this.teamString = JSON.stringify(this.teams, null, 2);
    for (const team of this.teams) {
      team.score = 0;
      team.miss = 0;
    }
    console.log(this.teams);
    this.activeTeam = this.teams[0];
    this.teamCount = this.teams.length;
  }

  onClickScoreButton(score: number) {
    if (typeof this.activeTeam?.score === "number") {
      this.activeTeam.score += score;
      if (this.activeTeam.score > 50) {
        this.activeTeam.score = 25;
      }
      if (this.activeTeam.score === 50 && typeof this.activeTeam.totalScore === "number") {
        this.activeTeam.totalScore += 50;
      }
      if (score === 0 && typeof this.activeTeam.miss === "number") {
        this.activeTeam.miss += 1;
      } else {
        this.activeTeam.miss = 0;
      }
    }
    this.changeActiveTeam();
  }

  changeActiveTeam(): void {
    const activeIndex = this.teams.indexOf(this.activeTeam);
    if (activeIndex === this.teamCount - 1) {
      this.activeTeam = this.teams[0];
    } else {
      this.activeTeam = this.teams[activeIndex + 1];
    }
  }
}
