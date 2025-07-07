import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Player, Team, ScoreAppService } from '../../../core/service/ScoreAppService';
import { Subscription, throwIfEmpty } from 'rxjs';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.scss',
  standalone: false,
})
export class TeamCardComponent {
  @Output() modifyTeam = new EventEmitter();
  @Input() team: Team = {
    name: "",
    member: [],
    score: 0,
    totalScore: 0,
    miss: 0,
    currentPlayer: {name: "", id: ""},
  };
  @Input() members: Player[] = [];
  @Input() selectedID: string[] = [];

  constructor(
    private scoreAppService: ScoreAppService,
  ) {}

  ngOnInit(): void {
    if (this.team.member.length === 0) {
      this.addMember();
    }
  }

  removeMember(): void {
    this.team.member.pop();
  }

  addMember(): void {
    this.team.member.push({name: "ゲスト", id: "guest"});
    this.modifyTeam.emit(this.team);
  }

  changeMember(index: number, id: string): void {
    const matched = this.scoreAppService.getPlayerFromID(id);

    if (matched) {
      this.team.member[index] = matched;
    }
    this.modifyTeam.emit(this.team);
  }
  trackById(index: number, member: Player): string {
  return member.id;
}

}
