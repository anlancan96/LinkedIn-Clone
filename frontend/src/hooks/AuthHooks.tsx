import { useAppDispatch, useAppSelector } from './ReduxHooks';
import { useEffect } from 'react';

export function useAuth(): boolean{
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector(state => state.auth);

    useEffect(() => {
        
    }, [dispatch]);
    return isAuthenticated;
}