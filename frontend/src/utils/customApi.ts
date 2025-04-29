import axios from "axios";
import { RequestMethod } from "./types";

export const api = axios.create();

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const getRequest = async (url: string) => {
  try {
    const response = await api.request({ url });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const additonalRequest = async (
  url: string,
  data: any,
  method: RequestMethod = "POST"
) => {
  try {
    const response = await api.request({ url, method, data });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
