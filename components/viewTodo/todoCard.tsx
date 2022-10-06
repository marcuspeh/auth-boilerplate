import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import React, { useState } from 'react'
import { deleteTodo, markDone, markUndone, saveTodo } from '../../services/api/todoController'
import { ViewType } from '../../models/viewType'
import UserInput from '../atoms/userInput'

interface Props {
    title: string
    body: string
    date: string
    isDone: boolean
    todoId: string
    viewMode: ViewType
}

const TodoCard: React.FC<Props> = (props): JSX.Element => {
    const { title, body, date, isDone, todoId, viewMode, ...rest } = props

    const [currTitle, setTitle] = useState(title)
    const [currBody, setBody] = useState(body)
    const [titleError, setTitleError] = useState("")
    const [bodyError, setBodyError] = useState("")
    const [isEditing, setEditing] = useState(false)
    const [currIsDone, setIsDone] = useState(isDone)
    const [isNotDeleted, setIsNotDeleted] = useState(true)

    function onTitleChange(e: any): void {
        if (e.target.value.length > 0) {
            setTitle(e.target.value)
            setTitleError("")
        } else {
            setTitleError("Title is required")
        }
    }

    function onBodyChange(e: any): void {
        if (e.target.value.length > 0) {
            setBody(e.target.value)
            setBodyError("")
        } else {
            setBodyError("Body is required")
        }
    }

    function editButtonClick(e: any): void {
        setEditing(true)
    }

    async function saveButtonClick(e: any): Promise<void> {
        var isValid = true

        if (!currTitle || currTitle.length == 0) {
            setTitleError("Title is required")
            isValid = false
        }
        if (!currBody || currBody.length == 0) {
            setTitleError("Body is required")
            isValid = false
        }

        if (isValid) {
            const result = await saveTodo(todoId, currTitle, currBody)
            if (result.isSuccess) {
                setEditing(false)
            }
        }
    }

    async function deleteButtonClick(e: any): Promise<void> {
        const result = await deleteTodo(todoId)
        if (result.isSuccess) {
            setIsNotDeleted(false)
        }
    }

    async function markDoneButtonClick(e: any): Promise<void> {
        const result =  await markDone(todoId)
        if (result.isSuccess) {
            setIsDone(true)
        }
    }

    async function markPendingButtonClick(e: any): Promise<void> {
        const result = await markUndone(todoId)
        if (result.isSuccess) {
            setIsDone(false)
        }
    }

    if (!isNotDeleted) {
        return <></>
    }

    if (viewMode !== ViewType.VIEW_ALL && currIsDone !== isDone) {
        return <></>
    }
    
    return (
        <Card variant="outlined" sx={{my:2}}>
            <CardContent>
            { isEditing ? (
                <>
                <UserInput label={'Title'} type={'text'} error={titleError} 
                    onChange={onTitleChange} value={currTitle} />
                <Typography variant="body2" sx={{color: 'grey', mb: 1}}>{date}</Typography>
                <UserInput label={'Body'} type={'text'} error={bodyError} 
                    onChange={onBodyChange} value={currBody} isMultiline={true}/>
                </>
            ) : (
                <>
                <Typography variant='h5'>{currTitle}</Typography>
                <Typography variant="body2" sx={{color: 'grey', mb: 1 }}>{date}</Typography>
                <Typography variant='body1'>{currBody}</Typography>
                </>
            )}
            </CardContent>
            <CardActions>
            { isEditing ? (
                <>
                <Button size="small" onClick={saveButtonClick}>Save</Button>
                <Button size="small" onClick={deleteButtonClick}>Delete</Button>
                </>
            ) : (
                <>
                <Button size="small" onClick={editButtonClick}>Edit</Button>
                { currIsDone ? (
                    <Button size="small" onClick={markPendingButtonClick}>Mark as pending</Button>
                ) : (
                    <Button size="small" onClick={markDoneButtonClick}>Mark as done</Button>
                )}
                </>
            )}
            </CardActions>
        </Card>
    )
}

export default TodoCard