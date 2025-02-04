import { FormData } from '../types';
import axios from 'axios';

export const loginApi = async (credentials: FormData) => {
    const response = await axios.post('login', credentials);
    return response.data;
};

export const refreshTokenApi = async (token: string) => {
    const response = await axios.post('refresh-token', token);
    return response.data;
}

export const logoutApi = async (token: string) => {
    const response = await axios.post('logout', token);
    return response.data;
}