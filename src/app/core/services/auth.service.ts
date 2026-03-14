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
    public currentUser = signal<UserDto | null>(null);
    public isRefreshing = signal<boolean>(false);
    public refreshTokenSubject = new BehaviorSubject<boolean | null>(null);
    private readonly http = inject(HttpClient);

    login(credentials: LoginDto): Observable<boolean> {
        return this.http.post<any>(`${environment.apiUrl}/auth/login`, credentials, { withCredentials: true }).pipe(
            switchMap(() => {
                return this.getProfile();
            }),
            catchError(() => {
                this.currentUser.set(null);
                return of(false);
            })
        );
    }
    refreshToken(): Observable<boolean> {
        return this.http.post(`${environment.apiUrl}/auth/refresh-token`, {}, { withCredentials: true }).pipe(
            map(() => true),
            catchError(() => {
                this.currentUser.set(null);
                return of(false);
            })
        );
    }

    logout(): Observable<boolean> {
        return this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true }).pipe(
            tap(() => {
                this.currentUser.set(null);
            }),
            map(() => true),
            catchError(() => of(false))
        );
    }

    getProfile(): Observable<boolean> {
        return this.http.get<UserDto>(`${environment.apiUrl}/users/me`, {
            withCredentials: true,
            context: new HttpContext().set(SILENCE_ERRORS, true)
        }).pipe(
            tap((user) => {
                this.currentUser.set(user);
            }),
            map(() => true),
            catchError(() => {
                this.currentUser.set(null);
                return of(false);
            })
        );
    }
}