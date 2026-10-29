import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

type SectionId = 'home' | 'project' | 'process' | 'milestones' | 'highlights' | 'team' | 'acknowledgments';

interface NavItem {
  id: SectionId;
  label: string;
  shortLabel: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  protected readonly isMobile = signal(false);
  protected readonly drawerOpen = signal(true);
  protected readonly activeSection = signal<SectionId>('home');

  protected readonly navItems: NavItem[] = [
    { id: 'home', label: 'Home', shortLabel: 'Home', icon: '⌂' },
    { id: 'project', label: 'The project', shortLabel: 'Project', icon: '◇' },
    { id: 'process', label: 'How it works', shortLabel: 'Process', icon: '→' },
    { id: 'milestones', label: 'Milestones', shortLabel: 'Timeline', icon: '✓' },
    { id: 'highlights', label: 'Highlights', shortLabel: 'Highlights', icon: '✦' },
    { id: 'team', label: 'The team', shortLabel: 'Team', icon: '◎' },
    { id: 'acknowledgments', label: 'Acknowledgments', shortLabel: 'Thanks', icon: '♡' },
  ];

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.updateViewport();
    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          this.activeSection.set(visible.target.id as SectionId);
        }
      },
      { rootMargin: '-18% 0px -62% 0px', threshold: [0.05, 0.2, 0.5] },
    );

    this.navItems.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) this.observer?.observe(section);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  @HostListener('window:resize')
  protected updateViewport(): void {
    const mobile = window.innerWidth < 960;
    this.isMobile.set(mobile);
    this.drawerOpen.set(!mobile);
  }

  protected toggleDrawer(): void {
    this.drawerOpen.update((open) => !open);
  }

  protected navigateTo(id: SectionId): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.activeSection.set(id);
    if (this.isMobile()) this.drawerOpen.set(false);
  }
}
