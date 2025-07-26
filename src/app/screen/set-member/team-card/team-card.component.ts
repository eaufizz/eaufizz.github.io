import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Player, Team, ScoreAppService } from '../../../core/service/ScoreAppService';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.scss',
  standalone: false,
})
export class TeamCardComponent {
  @Output() modifyTeam = new EventEmitter();
  @Input() team!: Team;
  @Input() members: Player[] = [];
  @Input() selectedID: string[] = [];

  option: Player[] = [];

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
    this.modifyTeam.emit(this.team);
  }

  addMember(): void {
    this.team.member.push({name: "ゲスト", id: "guest", sets: []});
    this.modifyTeam.emit(this.team);
  }

  changeMember(index: number, id: string): void {
    const matched = this.scoreAppService.getPlayerFromID(id);

    if (matched) {
      this.team.member[index] = structuredClone(matched);
    }
    this.modifyTeam.emit(this.team);
  }

  trackById(index: number, member: Player): string {
    return member.id;
  }

  isUsed(id: string, selfId: string): boolean {
  if (id === 'guest') return false; // ゲストは何度でも選べる

  // 自分以外で使用されていれば除外
  return this.selectedID.includes(id) && id !== selfId;
}
}
