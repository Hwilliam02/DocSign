import axios from "axios";
import { store } from "../store/store";

const api = axios.create({ baseURL: "http://localhost:4000/api", withCredentials: true });

// Attach token from Redux store for requests
api.interceptors.request.use((cfg) => {
	const state = store.getState();
	const token = state.user?.accessToken || null;
	if (token && cfg.headers) {
		cfg.headers.Authorization = `Bearer ${token}`;
	}
	return cfg;
});

export default api;
