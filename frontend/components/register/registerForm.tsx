import { Alert, Box, Button, Typography } from '@mui/material'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { registerUser } from '../../services/api/userController'
import UserInput from '../atoms/userInput'


const RegisterForm: React.FC = (): JSX.Element => {
    const [inputName, setInputName] = useState("")
    const [inputEmail, setInputEmail] = useState("")
    const [inputPassword, setInputPassword] = useState("")
    const [inputPassword2, setInputPassword2] = useState("")

    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [password2Error, setPassword2Error] = useState("")
    const [authError, setAuthError] = useState("")

    useEffect(() => {
        if (inputEmail.length === 0 ||
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            .test(inputEmail)
        ) {
            setEmailError("")
        } else {
        setEmailError('Please enter a valid email address')
        }
    }, [inputEmail])

    useEffect(() => {
        if (inputPassword !== inputPassword2) {
            setPassword2Error("Password must match")
        } else {
            setPassword2Error("")
        }
    }, [inputPassword2])

    function onEmailInputChange(e: any): void {
            setInputEmail(e.target.value)
        }

    function onNameInputChange(e: any): void {
        setInputName(e.target.value)
        setNameError("")
    }

    function onPasswordInputChange(e: any): void {
        setInputPassword(e.target.value)
        setPasswordError("")
    }

    function onPassword2InputChange(e: any): void {
        setInputPassword2(e.target.value)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        var isValid: boolean = true

        if (inputName.length === 0) {
            setNameError("Name is required")
            isValid = false
        } 
        if (inputEmail.length === 0) {
            setEmailError("Email is required")
            isValid = false
        }
        if (inputPassword.length === 0) {
            setPasswordError("Password is required")
            setPassword2Error("")
            isValid = false
        } else if (inputPassword2.length === 0) {
            setPasswordError("")
            setPassword2Error("Password is required")
            isValid = false
        } else if (inputPassword !== inputPassword2) {
            setPasswordError("")
            setPassword2Error("Password must match")
            isValid = false
        } else {
            setPasswordError("")
            setPassword2Error("")
        }

        if (isValid) {
            const data = await registerUser(inputName, inputEmail, inputPassword)
            if (data.isSuccess) {
                Router.push('/login')
            } else {
                setAuthError(data.errorCode)
            }
        }
    }
    
    return (
        <Box component="form" onSubmit={handleSubmit} noValidate  sx={{ mt: 3, mb: 2, px: 3, py: 3, borderRadius: '10px' }} bgcolor="#d4e3fb">
            <Typography variant="h5">
                Register
            </Typography>
            {!!(authError.length !== 0) && <Alert severity="warning">{authError}</Alert>}
            <UserInput label={'Name'} type={'text'} error={nameError} onChange={onNameInputChange} />
            <UserInput label={'Email'} type={'email'} error={emailError} autoComplete={'email'} onChange={onEmailInputChange} />
            <UserInput label={'Password'} type={'password'} error={passwordError} autoComplete={'current-password'} onChange={onPasswordInputChange} />
            <UserInput label={'Password'} type={'password'} error={password2Error} onChange={onPassword2InputChange} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} >
                Sign Up
            </Button>
        </Box>
    )
}

export default   RegisterForm  ;