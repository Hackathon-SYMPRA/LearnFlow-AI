import axios from "axios";
import { API_BASE_URL, AXIOS_TIMEOUT, STORAGE_KEYS } from "@/constants";
import { storage } from "@/utils/storage";

class ApiClient {
  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: AXIOS_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const token = storage.get(STORAGE_KEYS.TOKEN);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          storage.remove(STORAGE_KEYS.TOKEN);
          storage.remove(STORAGE_KEYS.USER);
          const path = window.location.pathname;
          if (!path.includes("/login") && !path.includes("/register")) {
            window.location.href = "/login";
          }
        }
        return Promise.reject(this.normalizeError(error));
      },
    );
  }

  normalizeError(error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred. Please try again.";
    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status;
    normalizedError.code = error.response?.data?.code;
    normalizedError.details = error.response?.data?.details;
    return normalizedError;
  }

  async get(url, config) {
    const response = await this.instance.get(url, config);
    return response.data;
  }

  async post(url, data, config) {
    const response = await this.instance.post(url, data, config);
    return response.data;
  }

  async put(url, data, config) {
    const response = await this.instance.put(url, data, config);
    return response.data;
  }

  async patch(url, data, config) {
    const response = await this.instance.patch(url, data, config);
    return response.data;
  }

  async delete(url, config) {
    const response = await this.instance.delete(url, config);
    return response.data;
  }

  async download(url, config) {
    const response = await this.instance.get(url, {
      ...config,
      responseType: "blob",
    });
    return response.data;
  }

  async upload(url, formData, onProgress) {
    const response = await this.instance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 300000, // 5 minutes for uploads
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percent);
        }
      },
    });
    return response.data;
  }

  stream(url, data, onChunk, onDone, onError) {
    const token = storage.get(STORAGE_KEYS.TOKEN);
    fetch(`${API_BASE_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            onDone();
            break;
          }
          onChunk(decoder.decode(value, { stream: true }));
        }
      })
      .catch(onError);
  }
}

export const api = new ApiClient();
