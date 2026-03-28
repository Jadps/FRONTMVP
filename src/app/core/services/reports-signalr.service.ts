import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { MessageService } from 'primeng/api';
import { AuthService } from './auth.service';

export type ReportStatus = 'Idle' | 'Processing' | 'Ready';

@Injectable({
  providedIn: 'root'
})
export class ReportsSignalrService {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private hubConnection: signalR.HubConnection | null = null;

  public reportStatus = signal<ReportStatus>('Idle');

  constructor() {
    this.startConnection();
  }

  private startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl.replace('/api/v1.0', '')}/hubs/reports`, {
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

      this.messageService.add({
        severity: 'success',
        summary: 'Report Ready',
        detail: `Your ${data.reportType} is ready!`
      });

      if (data.fileUrl) {
        window.open(data.fileUrl, '_blank');
      }

      setTimeout(() => this.reportStatus.set('Idle'), 10000);
    });
  }

  public generateReport() {
    this.reportStatus.set('Processing');
    this.messageService.add({
      severity: 'info',
      summary: 'Processing',
      detail: 'Requesting report to backend Worker...'
    });

    this.http.post(`${environment.apiUrl}/reports/generate`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
        },
        error: (err) => {
          this.reportStatus.set('Idle');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to request the report.'
          });
        }
      });
  }
}
