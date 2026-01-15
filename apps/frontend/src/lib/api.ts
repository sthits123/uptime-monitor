import axios, { AxiosError } from 'axios';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Types
export interface SignupInput {
	username: string;
	password: string;
}

export interface SigninInput {
	username: string;
	password: string;
}

export interface AuthResponse {
	token: string;
	username: string;
}

export interface Website {
	id: string;
	url: string;
	user_id: string;
	time_added: string;
	status?: string | null;
	response_time_ms?: number | null;
	response_code?: number | null;
	last_checked_at?: string | null;
}

export interface CreateWebsiteInput {
	url: string;
}

export interface CreateWebsiteResponse {
	id: string;
	url: string;
}

export interface RegionalStatus {
	region_name: string;
	status: string;
	response_time_ms: number;
	last_checked: string;
}

// API Client
class ApiClient {
	private baseURL: string;

	constructor(baseURL: string) {
		this.baseURL = baseURL;
	}

	private getAuthHeader(): Record<string, string> {
		const token = localStorage.getItem('token');
		if (token) {
			return { Authorization: `Bearer ${token}` };
		}
		return {};
	}

	// Auth endpoints
	async signup(input: SignupInput): Promise<AuthResponse> {
		try {
			const response = await axios.post<AuthResponse>(
				`${this.baseURL}/api/v1/signup`,
				input,
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			return response.data;
		} catch (error) {
			if (error instanceof AxiosError && error.response?.data?.message) {
				throw new Error(error.response.data.message);
			}
			throw new Error('Failed to create account. Please check your connection.');
		}
	}

	async signin(input: SigninInput): Promise<AuthResponse> {
		try {
			const response = await axios.post<AuthResponse>(
				`${this.baseURL}/api/v1/signin`,
				input,
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			return response.data;
		} catch (error) {
			if (error instanceof AxiosError && error.response?.data?.message) {
				throw new Error(error.response.data.message);
			}
			throw new Error('Failed to sign in. Please check your credentials.');
		}
	}

	// Website endpoints
	async getWebsites(): Promise<Website[]> {
		try {
			const response = await axios.get<Website[]>(
				`${this.baseURL}/api/v1/websites`,
				{
					headers: {
						...this.getAuthHeader(),
					},
				}
			);
			return response.data || [];
		} catch (error) {
			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					localStorage.removeItem('token');
					window.location.href = '/signin';
				}
				throw new Error(error.response?.data?.message || 'Failed to fetch websites');
			}
			throw error;
		}
	}

	async createWebsite(input: CreateWebsiteInput): Promise<CreateWebsiteResponse> {
		try {
			const response = await axios.post<CreateWebsiteResponse>(
				`${this.baseURL}/api/v1/websites`,
				input,
				{
					headers: {
						'Content-Type': 'application/json',
						...this.getAuthHeader(),
					},
				}
			);
			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					localStorage.removeItem('token');
					window.location.href = '/signin';
				}
				throw new Error(error.response?.data?.message || 'Failed to create website');
			}
			throw error;
		}
	}

	async getWebsite(id: string): Promise<Website> {
		try {
			const response = await axios.get<Website>(
				`${this.baseURL}/api/v1/websites/${id}`,
				{
					headers: {
						...this.getAuthHeader(),
					},
				}
			);
			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					localStorage.removeItem('token');
					window.location.href = '/signin';
				}
				throw new Error(error.response?.data?.message || 'Failed to fetch website');
			}
			throw error;
		}
	}

	async deleteWebsite(id: string): Promise<void> {
		try {
			await axios.delete(
				`${this.baseURL}/api/v1/websites/${id}`,
				{
					headers: {
						...this.getAuthHeader(),
					},
				}
			);
		} catch (error) {
			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					localStorage.removeItem('token');
					window.location.href = '/signin';
				}
				throw new Error(error.response?.data?.message || 'Failed to delete website');
			}
			throw error;
		}
	}

	async getWebsiteHistory(id: string, limit: number = 20): Promise<any[]> {
		try {
			const response = await axios.get<any[]>(
				`${this.baseURL}/api/v1/websites/${id}/history?limit=${limit}`,
				{
					headers: {
						...this.getAuthHeader(),
					},
				}
			);
			return response.data || [];
		} catch (error) {
			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					localStorage.removeItem('token');
					window.location.href = '/signin';
				}
				throw new Error(error.response?.data?.message || 'Failed to fetch history');
			}
			throw error;
		}
	}

	async getWebsiteRegionalStatus(id: string): Promise<RegionalStatus[]> {
		try {
			const response = await axios.get<RegionalStatus[]>(
				`${this.baseURL}/api/v1/websites/${id}/regions`,
				{
					headers: {
						...this.getAuthHeader(),
					},
				}
			);
			return response.data || [];
		} catch (error) {
			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					localStorage.removeItem('token');
					window.location.href = '/signin';
				}
				throw new Error(error.response?.data?.message || 'Failed to fetch regional status');
			}
			throw error;
		}
	}

	// Health check
	async healthCheck(): Promise<{ status: string }> {
		try {
			const response = await axios.get<{ status: string }>(
				`${this.baseURL}/api/v1/healthcheck`
			);
			return response.data;
		} catch (error) {
			throw new Error('Health check failed');
		}
	}
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Auth helpers
export const isAuthenticated = (): boolean => {
	return !!localStorage.getItem('token');
};

export const getToken = (): string | null => {
	return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
	localStorage.setItem('token', token);
};

export const removeToken = (): void => {
	localStorage.removeItem('token');
};

export const logout = (): void => {
	removeToken();
	window.location.href = '/signin';
};
