import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppTheme, ThemeService } from '@lib/services/theme';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css'],
})
export class HomePage implements OnInit, OnDestroy {
  currentTheme!: AppTheme | null;

  private _destroy$ = new Subject();

  constructor(private _themeService: ThemeService) {}

  ngOnInit(): void {
    this._themeService.currentTheme$
      .pipe(takeUntil(this._destroy$))
      .subscribe((theme) => (this.currentTheme = theme));
  }

  ngOnDestroy(): void {
    this._destroy$.complete();
    this._destroy$.unsubscribe();
  }

  handleThemeChange(theme: AppTheme): void {
    this._themeService.setTheme(theme);
  }
}
