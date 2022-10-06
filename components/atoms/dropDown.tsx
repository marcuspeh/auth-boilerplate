import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { ViewType } from '../../models/viewType'

interface Props {
    value: ViewType
    onClick: (e: any) => void
}

const DropDown: React.FC<Props> = (props): JSX.Element => {
    const { value, onClick, ...rest } = props
  
    return (
        <FormControl fullWidth>
            <InputLabel id="selectView">View</InputLabel>
            <Select
                labelId="selectView"
                value={value}
                label="View"
                onChange={onClick}
            >
                <MenuItem value={ViewType.VIEW_ALL}>All</MenuItem>
                <MenuItem value={ViewType.VIEW_UNDONE}>Pending</MenuItem>
                <MenuItem value={ViewType.VIEW_DONE}>Done</MenuItem>
            </Select>
        </FormControl>
    )
}

export default DropDown