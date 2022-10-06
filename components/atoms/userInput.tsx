import { TextField, Typography } from '@mui/material'
import styled from '@emotion/styled'
import React from 'react'

interface Props {
    label: string
    type: string
    error: string
    isMultiline?: boolean
    autoComplete?: string
    value?: string
    onChange: (e: any) => void  
}

const StyledTypography = styled(Typography) `
    color: red
`
  
const UserInput: React.FC<Props> = (props): JSX.Element => {
    const { label, type, error, isMultiline, autoComplete, value, onChange, ...rest } = props


    return (
      <div>
        <TextField
            required
            fullWidth
            error ={error.length !== 0}
            label={label}
            type={type}
            onChange={onChange}
            autoComplete={autoComplete}
            value={value}
            multiline={isMultiline}
            size='small'
            sx={{ mt: 2, boxShadow: 1, backgroundColor: '#FFFFFF', borderRadius: '10px' }}
        />
        {!!(error.length !== 0) && <StyledTypography variant="body2" >{error}</StyledTypography>}
      </div>
    )
}

export default UserInput;