import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SILENCE_ERRORS } from './http-context.tokens';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (req.context.get(SILENCE_ERRORS)) {
                return throwError(() => error);
            }

            if (error.status === 401 && !req.url.includes('/auth/')) {
                return handle401Error(req, next, authService, router, error);
            }
            return throwError(() => error);
        })
    );
};

const handle401Error = (req: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService, router: Router, originalError: HttpErrorResponse): Observable<HttpEvent<any>> => {
    if (!authService.isRefreshing()) {
        authService.isRefreshing.set(true);
        authService.refreshTokenSubject.next(null);

        return authService.refreshToken().pipe(
            switchMap((success) => {
                authService.isRefreshing.set(false);
                if (success) {
                    authService.refreshTokenSubject.next(true);
                    return next(req);
                } else {
                    authService.refreshTokenSubject.next(false);
                    router.navigate(['/login']);
                    return throwError(() => originalError);
                }
            }),
            catchError((err) => {
                authService.isRefreshing.set(false);
                authService.refreshTokenSubject.next(false);
                router.navigate(['/login']);
                return throwError(() => err);
            })
        );
    } else {
        return authService.refreshTokenSubject.pipe(
            filter(result => result !== null),
            take(1),
            switchMap((success) => {
                if (success) {
                    return next(req);
                } else {
                    return throwError(() => originalError);
                }
            })
        );
    }
};