import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { UserInfo } from '../interfaces/UserInfo';
import AuthService from './AuthService';

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN;

const githubApi = axios.create({
    baseURL: GITHUB_API_URL,
});

githubApi.interceptors.request.use((config) => {
    // Priorizar el token del .env si existe, sino usar el del login
    const token = GITHUB_TOKEN || AuthService.getToken();

    console.log('🔑 Token disponible:', token ? `${token.substring(0, 10)}...` : 'NO HAY TOKEN');
    console.log('📍 Origen del token:', GITHUB_TOKEN ? '.env' : 'localStorage');

    if (token) {
        config.headers.Authorization = `Bearer ${token.trim()}`;
    } else {
        console.error('❌ No se encontró ningún token de GitHub');
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

/**
 * Obtiene los repositorios del usuario autenticado
 */
export const fetchRepositories = async (): Promise<RepositoryItem[]> => {
    try {
        console.log('📡 Solicitando repositorios a GitHub...');
        const response = await githubApi.get(`/user/repos`, {
            params: {
                per_page: 100,
                sort: "created",
                direction: "desc",
                affiliation: "owner",
            }
        });

        console.log('✅ Respuesta recibida:', response.status);

        // VALIDACIÓN ANTI-ERROR: Si la respuesta es HTML (localhost) o error, devolvemos array vacío
        if (!Array.isArray(response.data)) {
            console.error("❌ La API no devolvió un arreglo. Revisa la pestaña Network.");
            return [];
        }

        console.log(`📦 ${response.data.length} repositorios encontrados`);

        const repositories: RepositoryItem[] = response.data.map((repo: any) => ({
            name: repo.name,
            description: repo.description || "Sin descripción",
            imageurl: repo.owner?.avatar_url || null,
            owner: repo.owner?.login || null,
            language: repo.language || "N/A",
        }));

        return repositories;

    } catch (error: any) {
        const errorMsg = error.response?.data?.message || error.message;
        const status = error.response?.status;

        console.error("❌ Error al obtener repositorios:");
        console.error("  - Status:", status);
        console.error("  - Mensaje:", errorMsg);

        if (status === 401) {
            console.error("  - Token inválido o expirado. Genera un nuevo token en: https://github.com/settings/tokens");
        } else if (status === 403) {
            console.error("  - Token sin permisos suficientes. Asegúrate de tener el scope 'repo'");
        }

        return [];
    }
}

/**
 * Crea un nuevo repositorio
 */
export const createRepository = async (repo: any): Promise<void> => {
    try {
        const response = await githubApi.post(`/user/repos`, repo);
        console.log("Repositorio creado con éxito:", response.data);
    } catch (error: any) {
        const errorMsg = error.response?.data?.message || error.message;
        console.error("Error al crear el repositorio:", errorMsg);
        throw error;
    }
};

/**
 * Obtiene la información del perfil del usuario
 */
export const getUserInfo = async (): Promise<UserInfo> => {
    try {
        const response = await githubApi.get(`/user`);
        return response.data as UserInfo;
    } catch (error: any) {
        console.error("Error al obtener info del usuario:", error.response?.data?.message || error.message);
        return {
            login: "invitado",
            name: "Usuario no encontrado",
            bio: "Verifica los permisos de tu Token.",
            avatar_url: "https://img.icons8.com/ios_filled/1200/unfriend-male.jpg",
        };
    }
};

/**
 * Elimina un repositorio
 */
export const deleteRepository = async (owner: string, repoName: string): Promise<void> => {
    try {
        console.log(`🗑️ Eliminando repositorio: ${owner}/${repoName}`);
        const response = await githubApi.delete(`/repos/${owner}/${repoName}`);
        console.log("✅ Repositorio eliminado con éxito:", response.status);
    } catch (error: any) {
        const errorMsg = error.response?.data?.message || error.message;
        const status = error.response?.status;

        console.error("❌ Error al eliminar el repositorio:");
        console.error("  - Status:", status);
        console.error("  - Mensaje:", errorMsg);

        if (status === 404) {
            console.error("  - El repositorio no existe o ya fue eliminado");
        } else if (status === 403) {
            console.error("  - No tienes permisos para eliminar este repositorio");
            console.error("  - Asegúrate de que el token tenga el scope 'delete_repo'");
        }

        throw error;
    }
};

/**
 * Actualiza un repositorio existente
 */
export const updateRepository = async (
    owner: string,
    repoName: string,
    updates: { name?: string; description?: string }
): Promise<void> => {
    try {
        console.log(`✏️ Actualizando repositorio: ${owner}/${repoName}`);
        const response = await githubApi.patch(`/repos/${owner}/${repoName}`, updates);
        console.log("✅ Repositorio actualizado con éxito:", response.data);
    } catch (error: any) {
        const errorMsg = error.response?.data?.message || error.message;
        const status = error.response?.status;

        console.error("❌ Error al actualizar el repositorio:");
        console.error("  - Status:", status);
        console.error("  - Mensaje:", errorMsg);

        if (status === 404) {
            console.error("  - El repositorio no existe");
        } else if (status === 422) {
            console.error("  - Datos de actualización inválidos");
        }

        throw error;
    }
};