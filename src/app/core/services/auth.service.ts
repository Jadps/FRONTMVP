import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SILENCE_ERRORS } from '../interceptors/http-context.tokens';

import { UserDto } from '../models/user.dto';
import { LoginDto } from '../models/auth.dto';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly AUTH_STATUS_KEY = 'auth_status';
    public currentUser = signal<UserDto | null>(null);
    public isRefreshing = signal<boolean>(false);
    public refreshTokenSubject = new BehaviorSubject<boolean | null>(null);
    private readonly http = inject(HttpClient);

    isAuthenticatedHint(): boolean {
        return localStorage.getItem(this.AUTH_STATUS_KEY) === 'loggedIn';
    }

    login(credentials: LoginDto): Observable<boolean> {
        return this.http.post<any>(`${environment.apiUrl}/auth/login`, credentials, { withCredentials: true }).pipe(
            tap(() => {
                localStorage.setItem(this.AUTH_STATUS_KEY, 'loggedIn');
            }),
            switchMap(() => {
                return this.getProfile();
            }),
            catchError(() => {
                this.clearSession();
                return of(false);
            })
        );
    }

    refreshToken(): Observable<boolean> {
        return this.http.post(`${environment.apiUrl}/auth/refresh-token`, {}, { withCredentials: true }).pipe(
            map(() => true),
            catchError(() => {
                this.clearSession();
                return of(false);
            })
        );
    }

    logout(): Observable<boolean> {
        return this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true }).pipe(
            tap(() => {
                this.clearSession();
            }),
            map(() => true),
            catchError(() => {
                this.clearSession();
                return of(false);
            })
        );
    }

    clearSession(): void {
        localStorage.setItem(this.AUTH_STATUS_KEY, 'loggedOut');
        this.currentUser.set(null);
    }

    getProfile(): Observable<boolean> {
        return this.http.get<UserDto>(`${environment.apiUrl}/users/me`, {
            withCredentials: true
        }).pipe(
            tap((user) => {
                this.currentUser.set(user);
            }),
            map(() => true),
            catchError(() => {
                this.clearSession();
                return of(false);
            })
        );
    }
}