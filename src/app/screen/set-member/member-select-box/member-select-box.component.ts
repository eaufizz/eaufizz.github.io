import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from '../../../core/service/ScoreAppService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-member-select-box',
  templateUrl: './member-select-box.component.html',
  styleUrl: './member-select-box.component.scss',
  standalone: false,
})
export class MemberSelectBoxComponent {
  @Output() memberSelected = new EventEmitter<string>();
  @Input() initialID: string = "";
  @Input() selectedID: string[] = [];
  @Input() options: Player[] = [];

  selectedOption?: Player;
  private subscription = new Subscription();

  ngOnInit(): void {
    if (this.options?.length && this.initialID) {
      const matched = this.options.find(p => p.id === this.initialID);
      this.selectedOption = matched ?? this.options.find(p => p.id === 'guest');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSelected(player: Player): void {
    const matched = this.options.find(m => m.id === player.id);
    if (matched) {
      this.selectedOption = matched;
      this.memberSelected.emit(matched.id);
    }
  }

  isSelected(id: string): boolean {
    return id !== 'guest' && this.selectedID.includes(id);
  }

  compareById(a: Player, b: Player): boolean {
    return !!a && !!b && a.id == b.id;
  }
}
