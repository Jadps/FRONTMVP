import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh-token')) {

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
                                authService.logout().subscribe();
                                return throwError(() => error);
                            }
                        }),
                        catchError((refreshError) => {
                            authService.isRefreshing.set(false);
                            authService.logout().subscribe();
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
