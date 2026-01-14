import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { UserInfo } from '../interfaces/UserInfo';

// 1. FORZAMOS LA URL Y EL TOKEN DIRECTAMENTE DESDE EL ENV
const GITHUB_API_URL = 'https://api.github.com'; 
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN;

const githubApi = axios.create({
    baseURL: GITHUB_API_URL,
});

githubApi.interceptors.request.use((config) => {
    // Priorizamos el token del archivo .env para asegurar la conexión
    if (GITHUB_TOKEN) {
        config.headers.Authorization = `Bearer ${GITHUB_TOKEN.trim()}`;
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
        const response = await githubApi.get(`/user/repos`, {
            params: {
                per_page: 100,
                sort: "created",
                direction: "desc",
                affiliation: "owner",
            }
        });

        // VALIDACIÓN ANTI-ERROR: Si la respuesta es HTML (localhost) o error, devolvemos array vacío
        if (!Array.isArray(response.data)) {
            console.error("La API no devolvió un arreglo. Revisa la pestaña Network.");
            return [];
        }

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
        console.error("Error al obtener repositorios:", error.response?.status, errorMsg);
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