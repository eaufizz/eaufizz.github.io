import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routing.module';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { MatInputModule } from '@angular/material/input';
import { InputFormComponent } from './components/input-form/input-form.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ScoreAppComponent } from './screen/score-app/score-app.component';
import { FormsModule } from '@angular/forms';
import { SetMemberComponent } from './screen/set-member/set-member.component';
import { GameComponent } from './screen/game/game.screen';
import { SelectNumberOfTeamsComponent } from './screen/select-number-of-teams/select-number-of-teams.component';
import { TeamCardComponent } from './screen/set-member/team-card/team-card.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MemberSelectBoxComponent } from './screen/set-member/member-select-box/member-select-box.component';
import { ResultComponent } from './screen/result/result.screen';
import { ExitDialogComponent } from './components/exit-dialog/exit-dialog.component';
import { CheckNameDialogComponent } from './components/check-name-dialog/check-name-dialog.component';
import { StartGameDialogComponent } from './components/start-game-dialog/start-game-dialog.component';
import { SelectPlayerComponent } from './screen/select-player/select-player.component';
import { ViewDataComponent } from './screen/view-data/view-data.component';
import { MatMenuModule } from '@angular/material/menu';
import { ChangeNameDialogComponent } from './components/change-name-dialog/change-name-dialog.component';
import { DeletePlayerDialogComponent } from './components/delete-player-dialog/delete-player-dialog.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ServiceWorkerModule } from '@angular/service-worker';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { ContinueGameDialogComponent } from './components/continue-game-dialog/continue-game-dialog.component';
import { ScoreInfoComponent } from './components/score-info/score-info.component';

@NgModule({
  declarations: [
    InputFormComponent,
    HeaderComponent,
    ScoreAppComponent,
    AppComponent,
    SetMemberComponent,
    GameComponent,
    SelectNumberOfTeamsComponent,
    TeamCardComponent,
    MemberSelectBoxComponent,
    ResultComponent,
    ExitDialogComponent,
    CheckNameDialogComponent,
    StartGameDialogComponent,
    SelectPlayerComponent,
    ViewDataComponent,
    ChangeNameDialogComponent,
    DeletePlayerDialogComponent,
    PrivacyPolicyComponent,
    PlayerListComponent,
    ContinueGameDialogComponent,
    ScoreInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    MatInputModule,
    RouterModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    NgxChartsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
