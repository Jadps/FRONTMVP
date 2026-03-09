import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';

const baseurl = "https://localhost:44329";
const version = "v1.0";

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

    constructor(private http: HttpClient) { }

    login(credentials: LoginCredentials): Observable<boolean> {
        return this.http.post<any>(`${baseurl}/api/${version}/auth/login`, credentials, { withCredentials: true }).pipe(
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
        return this.http.post(`${baseurl}/api/${version}/auth/refresh-token`, {}, { withCredentials: true }).pipe(
            map(() => true),
            catchError(() => {
                this.currentUser.set(null);
                return of(false);
            })
        );
    }

    logout(): Observable<boolean> {
        return this.http.post(`${baseurl}/api/${version}/auth/logout`, {}, { withCredentials: true }).pipe(
            tap(() => {
                this.currentUser.set(null);
            }),
            map(() => true),
            catchError(() => of(false))
        );
    }

    getProfile(): Observable<boolean> {
        return this.http.get<UsuarioDTO>(`${baseurl}/api/${version}/usuarios/me`, { withCredentials: true }).pipe(
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