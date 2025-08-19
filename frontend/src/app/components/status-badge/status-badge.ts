import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import { input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type BadgeStatus = string;

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBadge {
  status = input<BadgeStatus>('Pending');

  badgeClasses = computed(() => {
    const statusClass = `badge--${this.status().toLowerCase()}`;
    return `badge ${statusClass}`;
  });
}
