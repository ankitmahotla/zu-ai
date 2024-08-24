import useAuthStore from '@/store/useAuthStore';
import axios from 'axios';

const accessToken = useAuthStore.getState().accessToken;

export const api = axios.create({
  baseURL: 'https://zu-ai.onrender.com/api',
  headers: {
    "Authorization": `Bearer ${accessToken}`
  }
});