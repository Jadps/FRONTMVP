import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleManagerService } from './role-manager.service';
import { RoleFormDialogComponent } from './role-form-dialog.component';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-roles-page',
    standalone: true,
    templateUrl: './roles-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        TagModule,
        RoleFormDialogComponent
    ]
})
export class RolesPageComponent implements OnInit {
    readonly manager = inject(RoleManagerService);

    ngOnInit() {
        this.manager.loadRoles();
    }

    onOpenDialog() {
        this.manager.openNewRoleDialog();
    }

    onEdit(role: any) {
        this.manager.openEditRoleDialog(role);
    }
}
