import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000', // TODO: fix this to use env variable
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,  // set so we can send http cookies
});

export default axiosClient;
