import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import { Controller } from 'react-hook-form'
import { useAuth } from '../../Context/auth'
import { getName } from '../../Utils/chatLogic'

const RHFAutoComplete = ({name, label, options, errors, control, setValue}) => {
    const [auth] = useAuth();
  return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState: {error}}) => (
                <Autocomplete
                {...field}
                multiple
                freeSolo
                sx={{width: "100%"}}
                id="multiple-limit-tags"
                options={options.map((option) => option)}
                onChange={(event, newValue) =>
                    setValue(name, newValue, { shouldValidate: true })
                }

                getOptionLabel={(option) => (option.isGroupChat ? option.chatName : getName(option, auth))}

                renderInput={(params) => (
                    <TextField  {...params} label={label} error={!!error} helperText={error ? error?.message : ""} placeholder="Add" />
                )}
                />
            )}
        />
  )
}

export default RHFAutoComplete
