import React from "react";
import AuthForm from "../components/AuthForm";
import { SubmitHandler, UseFormProps } from "react-hook-form";
import { FormData } from "../types";

export default function LoginPage() {
    const onSubmit: SubmitHandler<FormData> = (data) => {
        console.log(data);
    }   
    const config: UseFormProps<FormData> = {
        mode: 'onSubmit',
        disabled: false,
    }
    return <AuthForm btnContent="Login" onSubmit={onSubmit} config={config}/>
}