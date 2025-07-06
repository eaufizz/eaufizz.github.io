import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { ScoreAppComponent } from './screen/score-app/score-app.component';
import { SetMemberComponent } from './screen/set-member/set-member.component';
import { GameComponent } from './screen/game/game.screen';
import { SelectNumberOfTeamsComponent } from './screen/select-number-of-teams/select-number-of-teams.component';

const routes: Routes = [
  { path: '', component: ScoreAppComponent },
  { path: 'score', component: ScoreAppComponent },
  { path: 'select-team', component: SelectNumberOfTeamsComponent },
  { path: 'set-member', component: SetMemberComponent },
  { path: 'game', component: GameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

export const appRoutes: Routes = routes;
