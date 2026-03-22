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

export interface AnomalyScore {
	website_id: string;
	has_anomaly: boolean;
	score: number;
	confidence: number;
	reason: string;
	response_time_ms: number;
	region: string;
	detected_at?: string;
	stats?: {
		total_events: number;
		anomaly_count: number;
		avg_score: number;
		last_anomaly_at?: string;
	};
}

export interface AnomalyEvent {
	id: string;
	website_id: string;
	region_id: string;
	response_time_ms: number;
	anomaly_score: number;
	confidence: number;
	reason: string;
	is_anomaly: boolean;
	created_at: string;
	region_name?: string;
	website_url?: string;
}

export interface RegionalTick {
	RegionID: string;
	RegionName: string;
	ResponseTimeMs: number;
	Status: string;
	CreatedAt: string;
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

	async getRegionalHistory(id: string, limit: number = 100): Promise<RegionalTick[]> {
		try {
			const response = await axios.get<RegionalTick[]>(
				`${this.baseURL}/api/v1/websites/${id}/regional-history?limit=${limit}`,
				{
					headers: {
						...this.getAuthHeader(),
					},
				}
			);
			return response.data || [];
		} catch (error) {
			return [];
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

	// Anomaly endpoints
	async getAnomalyScore(websiteId: string): Promise<AnomalyScore> {
		try {
			const response = await axios.get<AnomalyScore>(
				`${this.baseURL}/api/v1/anomaly/score?website_id=${websiteId}`
			);
			return response.data;
		} catch (error) {
			return {
				website_id: websiteId,
				has_anomaly: false,
				score: 0,
				confidence: 0,
				reason: "normal",
				response_time_ms: 0,
				region: "",
			};
		}
	}

	async getAnomalyEvents(websiteId: string, limit: number = 20): Promise<AnomalyEvent[]> {
		try {
			const response = await axios.get<{ events: AnomalyEvent[]; count: number }>(
				`${this.baseURL}/api/v1/anomaly/website?website_id=${websiteId}&limit=${limit}`
			);
			return response.data.events || [];
		} catch (error) {
			return [];
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
