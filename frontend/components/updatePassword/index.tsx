import { Box, Button, Link, Typography } from '@mui/material'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { loginUser, updatePassword } from '../../services/api/userController'
import UserInput from '../atoms/userInput'


const UpdatePasswordForm: React.FC = (): JSX.Element => {
    const [inputPassword, setInputPassword] = useState("")
    const [inputNewPassword, setInputNewPassword] = useState("")
    const [inputConfirmNewPassword, setInputConfirmNewPassword] = useState("")

    const [passwordError, setPasswordError] = useState("")
    const [newPasswordError, setNewPasswordError] = useState("")
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("")

    useEffect(() => {
        if (inputConfirmNewPassword.length === 0) {
            return
        }

        if (inputNewPassword === inputConfirmNewPassword) {
            setConfirmNewPasswordError("")
            return
        }
        setConfirmNewPasswordError('New password does not match')
    }, [inputConfirmNewPassword, inputNewPassword])

    function onInputPasswordChange(e: any): void {
        setInputPassword(e.target.value)
        setPasswordError("")
    }

    function onInputNewPassword(e: any): void {
        setInputNewPassword(e.target.value)
        setNewPasswordError("")
    }

    function onInputConfirmNewPassword(e: any): void {
        setInputConfirmNewPassword(e.target.value)
        setConfirmNewPasswordError("")
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        var isValid: boolean = true

        if (inputPassword.length === 0) {
            setPasswordError("Password is required")
            isValid = false
        } 
        if (inputNewPassword.length === 0) {
            setNewPasswordError("New password is required")
            isValid = false
        }
        if (inputConfirmNewPassword.length === 0) {
            setConfirmNewPasswordError("Confirm password is required")
            isValid = false
        }
        if (isValid && inputNewPassword !== inputConfirmNewPassword) {
            setConfirmNewPasswordError("New password does not match")
            isValid = false
        }

        if (isValid) {
            const data = await updatePassword(inputPassword, inputNewPassword)
            if (data.isSuccess) {
                setInputPassword("")
                setInputNewPassword("")
                setInputConfirmNewPassword("")
            } else {
                setConfirmNewPasswordError(data.errorCode)
            }
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate  sx={{ mt: 3, mb: 2, px: 3, py: 3, borderRadius: '10px' }} bgcolor="#d4e3fb">
            <Typography variant="h5">
                Update Password
            </Typography>
            <UserInput label={'OriginalPassword'} type={'password'} error={passwordError} 
                autoComplete={'current-password'} onChange={onInputPasswordChange} value={inputPassword} />
            <UserInput label={'New Password'} type={'password'} error={newPasswordError} 
                onChange={onInputNewPassword} value={inputNewPassword} />
            <UserInput label={'Confirm New Password'} type={'password'} error={confirmNewPasswordError} 
                onChange={onInputConfirmNewPassword} value={inputConfirmNewPassword}/>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} >
                Update
            </Button>
        </Box>
    )
}

export default UpdatePasswordForm;