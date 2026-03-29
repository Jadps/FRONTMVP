import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

export type ReportStatus = 'Idle' | 'Processing' | 'Ready';

@Injectable({
  providedIn: 'root'
})
export class ReportsSignalrService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private hubConnection: signalR.HubConnection | null = null;

  public reportStatus = signal<ReportStatus>('Idle');

  constructor() {
    this.startConnection();
  }

  private startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.hubUrl}/reports`, {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.addListeners();
      })
      .catch(() => { });
  }

  private addListeners() {
    if (!this.hubConnection) return;

    this.hubConnection.on('ReportReady', (data: { reportType: string, completedAt: string, fileUrl?: string }) => {
      this.reportStatus.set('Ready');
      this.loadingService.hide();

      this.notificationService.success('Report Ready', `Your ${data.reportType} is ready!`);

      if (data.fileUrl) {
        window.open(data.fileUrl, '_blank');
      }

      setTimeout(() => this.reportStatus.set('Idle'), 10000);
    });
  }

  public generateReport(reportType: string = 'MonthlySummary') {
    this.reportStatus.set('Processing');
    this.loadingService.show();
    this.notificationService.info('Processing', `Requesting ${reportType} to backend Worker...`);

    this.http.post(`${environment.apiUrl}/reports/generate`, { reportType }, { withCredentials: true })
      .subscribe({
        next: () => {
        },
        error: (err) => {
          this.reportStatus.set('Idle');
          this.loadingService.hide();
          this.notificationService.error('Error', 'Failed to request the report.');
        }
      });
  }
}
