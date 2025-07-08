import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ScoreAppService,
  Team,
  Player,
} from '../../core/service/ScoreAppService';
import { throwIfEmpty } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.screen.html',
  styleUrls: ['./game.screen.scss'],
  standalone: false,
})
export class GameComponent {
  teams: Team[] = [];
  activeTeam: Team = {
    name: "",
    member: [],
    score: 0,
    totalScore: 0,
    miss: 0,
    currentPlayer: {name: "", id: ""},
  };
  teamCount: number = 0;
  setCount: number = 0;
  selectedButton: number = 13;

  constructor(
    private scoreAppService: ScoreAppService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.teams = this.scoreAppService.getSelectedTeams();
    if (this.teams.length === 0) {
      this.moveToSelectTeam();
    }
    this.setCount = this.scoreAppService.getSetCount() + 1;
    this.scoreAppService.setSetCount(this.setCount);
    for (const team of this.teams) {
      team.currentPlayer = team.member[0];
    }
    for (const team of this.teams) {
      team.score = 0;
      team.miss = 0;
    }
    this.activeTeam = this.teams[0];
    this.teamCount = this.teams.length;
  }

  onClickScoreButton(score: number) {
    this.selectedButton = score;
  }

  onClickSubmit(): void {
    if (typeof this.activeTeam?.score === "number") {
      this.activeTeam.score += this.selectedButton;
      if (this.activeTeam.score > 50) {
        this.activeTeam.score = 25;
      }
      if (this.activeTeam.score === 50 && typeof this.activeTeam.totalScore === "number") {
        this.finishSet();
      }
      if (this.selectedButton === 0 && typeof this.activeTeam.miss === "number") {
        this.activeTeam.miss += 1;
      } else {
        this.activeTeam.miss = 0;
      }
    }
    this.changeCurrentPlayer();
    this.changeActiveTeam();
    this.selectedButton = 13;
  }

  changeActiveTeam(): void {
    const activeIndex = this.teams.indexOf(this.activeTeam);
    if (activeIndex === this.teamCount - 1) {
      this.activeTeam = this.teams[0];
    } else {
      this.activeTeam = this.teams[activeIndex + 1];
    }
  }

  changeCurrentPlayer(): void {
    const activeIndex = this.activeTeam.member.indexOf(this.activeTeam.currentPlayer);
    if (activeIndex === this.activeTeam.member.length - 1) {
      this.activeTeam.currentPlayer = this.activeTeam.member[0];
    } else {
      this.activeTeam.currentPlayer = this.activeTeam.member[activeIndex + 1];
    }
  }

  finishSet(): void {
    for (const team of this.teams) {
      team.totalScore += team.score;
    }
    this.router.navigate(["result"]);
  }

  moveToBack(): void {
    this.router.navigate(["set-member"]);
  }

  moveToHome(): void {
    this.router.navigate([""]);
  }

  moveToSelectTeam(): void {
    this.router.navigate(["select-team"])
  }
}
