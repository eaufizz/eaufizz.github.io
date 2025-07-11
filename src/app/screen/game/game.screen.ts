import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  ScoreAppService,
  Team,
  Player,
  SnapShot,
} from '../../core/service/ScoreAppService';

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
  setCount: number = 0;
  selectedButton: number = 13;
  snapShot: SnapShot[] = [];
  showDialog: boolean = false;
  navigateRoot: string = "";

  constructor(
    private scoreAppService: ScoreAppService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.snapShot = this.scoreAppService.getSnapShot().slice();
    if (this.snapShot.length !== 0) {
      this.setCount = this.scoreAppService.getSetCount();
      this.onClickBack();
      return;
    }
    this.teams = this.scoreAppService.getSelectedTeams();
    if (this.teams.length === 0) {
      this.moveToSelectTeam();
    }
    this.setCount = this.scoreAppService.getSetCount();
    for (const team of this.teams) {
      team.currentPlayer = team.member[0];
    }
    for (const team of this.teams) {
      team.score = 0;
      team.miss = 0;
    }
    this.activeTeam = this.teams[0];
  }

  onClickScoreButton(score: number) {
    this.selectedButton = score;
  }

  onClickSubmit(): void {
    this.saveSnapShot();
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
        if (this.activeTeam.miss === 3) {
          this.activeTeam.score = 0;
        }
      } else {
        this.activeTeam.miss = 0;
      }
    }
    this.changeCurrentPlayer();
    if (this.checkGameIsSet()) {
      return;
    }
    this.changeActiveTeam();
    this.selectedButton = 13;
  }

  saveSnapShot(): void {
    const snap: SnapShot = {
      teams: structuredClone(this.teams),
      activeTeam: structuredClone(this.activeTeam),
    }
    this.snapShot.push(snap);
  }

  checkGameIsSet(): boolean {
    const result = this.teams.filter((team) =>
      team.miss < 3
    );
    if (this.teams.length === 1) {
      if (result.length === 0) {
        this.finishSet();
        return true;
      }
    } else {
      if (result.length <= 1) {
        result[0].score = 50;
        const index = this.teams.findIndex((team) =>
          result[0].name === team.name
        );
        this.teams[index] = result[0];
        this.finishSet();
        return true;
      }
    }
    return false;
  }

  changeActiveTeam(): void {
    const activeIndex = this.teams.indexOf(this.activeTeam);
    if (activeIndex === this.teams.length - 1) {
      this.activeTeam = this.teams[0];
    } else {
      this.activeTeam = this.teams[activeIndex + 1];
    }
    if (this.activeTeam.miss === 3) {
      this.changeActiveTeam();
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
    this.scoreAppService.setSelectedTeams(this.teams);
    this.scoreAppService.setSnapShot(this.snapShot);
    this.router.navigate(["result"]);
  }

  onClickBack(): void {
    const latest = this.snapShot.pop();
    if (latest !== undefined) {
      this.teams = latest.teams;
      const matched = this.teams.find(team => team.name === latest.activeTeam.name);
      if (matched) {
        this.activeTeam = matched;
      }
    }
    this.selectedButton = 13;
  }

  moveToBack(): void {
    this.showDialog = true;
    this.navigateRoot = "set-member";
  }

  moveToHome(): void {
    this.showDialog = true;
    this.navigateRoot = "";
  }

  closeDialog(): void {
    this.showDialog = false;
  }

  moveToSelectTeam(): void {
    this.router.navigate(["select-team"])
  }
}
