import axios, { AxiosInstance } from 'axios';

const service: AxiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

service.interceptors.request.use(
  (config) => config,
  (err) => Promise.reject(err)
);

service.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.log('请求错误：', err?.message);
    return Promise.reject(err);
  }
);

export default service;
