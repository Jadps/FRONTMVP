import { RolDTO } from './rol.dto';

export interface UsuarioDTO {
    id?: string;
    email: string;
    nombre: string;
    primerApellido: string;
    segundoApellido?: string | null;
    password?: string | null;
    tenantId?: number | null;
    roles: RolDTO[];
    nombreCompleto?: string | null;
}
