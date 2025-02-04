import React from 'react';
import { useForm, UseFormProps, SubmitHandler } from 'react-hook-form';
import { FormData } from '../../types';

interface AuthFormProps {
    btnContent: string;
    config: UseFormProps<FormData>;
    onSubmit: SubmitHandler<FormData>;
}

const AuthForm = (props: AuthFormProps) => {
  const { register, handleSubmit } = useForm<FormData>(props.config);
  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <input 
        type="text" 
        placeholder="Email or phone" 
        {...register('email', {
          required: 'Email or phone is required',
          validate: (value) => {
            // Email regex pattern
            const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            // Phone regex pattern (basic international format)
            const phonePattern = /^\+?[\d\s-]{10,}$/;
            
            if (emailPattern.test(value) || phonePattern.test(value)) {
              return true;
            }
            return 'Please enter a valid email or phone number';
          }
        })} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters'
          },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
          }
        })} 
      />
      <button type="submit">{props.btnContent}</button>
    </form>
  );
};
export default AuthForm;
