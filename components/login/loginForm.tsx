import { Box, Button, Link, Typography } from '@mui/material'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { loginUser } from '../../services/api/userController'
import UserInput from '../atoms/userInput'


const LoginForm: React.FC = (): JSX.Element => {
    const [inputEmail, setInputEmail] = useState("")
    const [inputPassword, setInputPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [authError, setAuthError] = useState("")

    useEffect(() => {
        if ( inputEmail.length == 0 || 
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            .test(inputEmail)
        ) {
            setEmailError("")
        } else {
            setEmailError('Please enter a valid email address')
        }
    }, [inputEmail])

    function onEmailInputChange(e: any): void {
        setInputEmail(e.target.value)
    }

    function onPasswordInputChange(e: any): void {
        setInputPassword(e.target.value)
        setAuthError("")
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        var isValid: boolean = true

        if (inputEmail.length === 0) {
            setEmailError("Email is required")
            isValid = false
        } 
        if (inputPassword.length === 0) {
            setAuthError("Password is required")
            isValid = false
        }

        if (isValid) {
            const data = await loginUser(inputEmail, inputPassword)
            if (data.isSuccess) {
                Router.push("/")
            } else {
                setAuthError(data.errorCode)
            }
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate  sx={{ mt: 3, mb: 2, px: 3, py: 3, borderRadius: '10px' }} bgcolor="#d4e3fb">
            <Typography variant="h5">
                Login
            </Typography>
            <UserInput label={'Email'} type={'email'} error={emailError} 
                autoComplete={'email'} onChange={onEmailInputChange} />
            <UserInput label={'Password'} type={'password'} error={authError} 
                autoComplete={'current-password'} onChange={onPasswordInputChange} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} >
                Sign In
            </Button>
        </Box>
    )
}

export default LoginForm;