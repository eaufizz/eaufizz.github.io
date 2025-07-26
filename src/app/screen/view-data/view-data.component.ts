import { Component } from '@angular/core';
import {
  Router,
  ActivatedRoute,
} from '@angular/router'
import { Player, ScoreAppService } from '../../core/service/ScoreAppService';

@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.component.html',
  styleUrl: './view-data.component.scss',
  standalone: false,
})
export class ViewDataComponent {
  target: Player = {
    name: "",
    id: "",
    sets: [],
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private scoreAppService: ScoreAppService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id !== null) {
      const player = this.scoreAppService.getPlayerFromID(id);
      if (player) {
        this.target = player;
      }

    }
  }

  moveToHome(): void {
    this.router.navigate(['']);
  }

  moveToBack(): void {
    this.router.navigate(['view-data']);
  }

  setTeamCount(value: number): void {
    this.scoreAppService.setTeamCount(value);
    this.router.navigate(["set-member"]);
    this.scoreAppService.setSelectedTeams([])
  }
}
