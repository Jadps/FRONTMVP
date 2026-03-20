import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MenuService } from '../services/menu.service';

export const permissionGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const menuService = inject(MenuService);

    const targetUrl = state.url;

    if (targetUrl === '/' || targetUrl === '/dashboard') {
        return true;
    }

    const allowedUrls = menuService.getAllowedUrls();

    const isAllowed = allowedUrls.some(url => targetUrl === url || targetUrl.startsWith(url + '/'));

    if (isAllowed) {
        return true;
    }

    console.warn(`Access denied for URL: ${targetUrl}. Not in allowed modules.`);
    return router.parseUrl('/dashboard');
};
