export interface ModuleDto {
    id?: string;
    description: string;
    icon?: string;
    action?: string;
    order: number;
    parentId?: string;
    subModules: ModuleDto[];
}
