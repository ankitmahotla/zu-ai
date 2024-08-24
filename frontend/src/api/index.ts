import useAuthStore from '@/store/useAuthStore';
import axios from 'axios';

const accessToken = useAuthStore.getState().accessToken;

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    "Authorization": `Bearer ${accessToken}`
  }
});