import React, { useState } from 'react';
import { useForm, UseFormProps, SubmitHandler } from 'react-hook-form';
import { FormData } from '../../types';
import './index.css';

export interface AuthFormProps {
    btnContent: string;
    config: UseFormProps<FormData>;
    onSubmit: SubmitHandler<FormData>;
}

const AuthForm = (props: AuthFormProps) => {
  const { register, handleSubmit } = useForm<FormData>(props.config);
  const [isShowPassword, setShowPassword] = useState(false);
  const showPassword = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setShowPassword(!isShowPassword);
  }
  return (
    <form onSubmit={handleSubmit(props.onSubmit)}  className="h-screen flex items-center justify-center flex-col text-xl">
      <div className="relative mt-[24px]">
        <input
            type="text"
            className="peer rounded-[4px] form__input--padding h-[52px] border border-solid border-light-border text-text focus:border-[#0a66c2] focus:border-2 focus:outline-none"
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
         <label className="absolute form__label--floating top-[0] left-[0] pointer-events-none
            peer-focus:-top-[10px] peer-focus:text-xs peer-active:-top-[10px] peer-active:text-xs">Email or phone</label>
      </div>
      <div className="relative mt-[24px]">
      <input 
        type={isShowPassword ? 'text': 'password' } 
        className="peer rounded-[4px] form__input--padding h-[52px] border border-solid border-light-border text-text focus:border-[#0a66c2] focus:border-2 focus:outline-none"
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
      <label className="absolute form__label--floating top-[0] left-[0] pointer-events-none
            peer-focus:-top-[10px] peer-focus:text-xs peer-active:-top-[10px] peer-active:text-xs">Password</label>
      <span className="absolute right-[4px] top-[14px] text-blue-600 text-[1rem] font-semibold pr-[8px] hover:cursor-pointer" onClick={showPassword}>Show</span>
      </div>
      <button type="submit">{props.btnContent}</button>
    </form>
  );
};
export default AuthForm;
