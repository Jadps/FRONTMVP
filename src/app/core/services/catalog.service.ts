import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ModuleDto } from '../models/module.dto';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private readonly http = inject(HttpClient);

  getMenuModules(): Observable<ModuleDto[]> {
    return this.http.get<ModuleDto[]>(`${environment.apiUrl}/catalogs/modules`, { withCredentials: true });
  }
}
