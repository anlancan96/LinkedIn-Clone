import { FormData } from '../types';
import axios from 'axios';

export const loginApi = async (credentials: FormData) => {
    const response = await axios.post('login', credentials);
    return response.data;
};

export const refreshTokenApi = async () => {
    setTimeout(function() {
        //Do some stuff here
     }, 3000);
    const response = await axios.post('refresh-token', { Credential: true });
    return response.data;
}

export const logoutApi = async (token: string) => {
    const response = await axios.post('logout', token);
    return response.data;
}