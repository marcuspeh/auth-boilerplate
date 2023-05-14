import { Box, Button, Alert } from '@mui/material'
import React, { useRef, useState } from 'react'
import { createNewTodo } from '../../services/api/todoController'
import UserInput from '../atoms/userInput'


const NewTodo: React.FC = (): JSX.Element => {
    const [inputBody, setInputBody] = useState("")
    const [inputTitle, setInputTitle] = useState("")
    const [bodyError, setBodyError] = useState("")
    const [titleError, setTitleError] = useState("")
    const [errorBannerMessage, setErrorBannerMessage] = useState("")
    const [successBannerMessage, setSuccessBannerMessage] = useState("")

    function onTitleInputChange(e: any): void {
        setInputTitle(e.target.value)
        if (e.target.value) {
            setTitleError("")
        } else {
            setTitleError("Title is required")
        }
    }

    function onBodyInputChange(e: any): void {
        setInputBody(e.target.value)
        if (e.target.value) {
            setBodyError("")
        } else {
            setBodyError("Body is required")
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        var isValid: boolean = true

        if (inputTitle.length === 0) {
            setTitleError("Title is required")
            isValid = false
        } 
        if (inputBody.length === 0) {
            setBodyError("Body is required")
            isValid = false
        }

        if (isValid) {
            const result = await createNewTodo(inputTitle, inputBody)
            if (result.isSuccess) {
                setSuccessBannerMessage("Todo added.")
                setInputTitle("")
                setInputBody("")
                setErrorBannerMessage("")
            } else {
                setErrorBannerMessage(result.errorCode)
                setSuccessBannerMessage("")
            }
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate  sx={{ mt: 3, mb: 2, px: 3, py: 3, borderRadius: '10px' }} bgcolor="#d4e3fb">
            {!!(errorBannerMessage.length !== 0) && <Alert severity="warning">{errorBannerMessage}</Alert>}
            {!!(successBannerMessage.length !== 0) && <Alert severity="success">{successBannerMessage}</Alert>}
            <UserInput label={'Title'} type={'text'} error={titleError} value={inputTitle} onChange={onTitleInputChange} />
            <UserInput label={'Body'} type={'text'} error={bodyError} value={inputBody} isMultiline={true} onChange={onBodyInputChange} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} >
                Create new
            </Button>
        </Box>
    )
}

export default NewTodo;
