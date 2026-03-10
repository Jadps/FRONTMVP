import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SILENCE_ERRORS } from '../interceptors/http-context.tokens';

import { UsuarioDTO } from '../models/usuario.dto';
export interface LoginCredentials {
    email: string;
    password?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public currentUser = signal<UsuarioDTO | null>(null);
    private readonly http = inject(HttpClient);

    login(credentials: LoginCredentials): Observable<boolean> {
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
        return this.http.get<UsuarioDTO>(`${environment.apiUrl}/usuarios/me`, {
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