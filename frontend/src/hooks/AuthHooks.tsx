import { useAppDispatch, useAppSelector } from './ReduxHooks';
import { refreshTokenApi } from '../services/authApi';
import { setUser } from '../features/auth/AuthSlice';
import { IUserResponse } from '../../../shared/src/users';
import { useMutation } from '@tanstack/react-query';

type UseAuthResult = {
    isPending: boolean,
    isAuthenticated: boolean,
}
export function useAuth(): UseAuthResult {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const mutation = useMutation({
        mutationKey: ['auth'],
        mutationFn: refreshTokenApi,
        retry: false,
        onSuccess: (data: IUserResponse) => {
            if (data?.accessToken) {
                dispatch(setUser(data));
            }
        },
        onError: () => {
            dispatch(setUser(null));
        }
    });
    return { isPending: mutation.isPending, isAuthenticated };
}
