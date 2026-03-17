import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {

            if (error.status === 401 &&
                !req.url.includes('/auth/login') &&
                !req.url.includes('/auth/refresh-token') &&
                !req.url.includes('/auth/logout')) {

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
                                authService.clearSession();
                                router.navigate(['/login']);
                                return throwError(() => error);
                            }
                        }),
                        catchError((refreshError) => {
                            authService.isRefreshing.set(false);
                            authService.clearSession();
                            router.navigate(['/login']);
                            return throwError(() => refreshError);
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
                                return throwError(() => error);
                            }
                        })
                    );
                }
            }

            return throwError(() => error);
        })
    );
};