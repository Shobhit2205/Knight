import { TextField } from '@mui/material'
import React from 'react'
import { Controller } from 'react-hook-form'

const RHFCodes = ({control, errors, otp }) => {

    const handleChange = (e, handleChange) => {
        const { value, name } = e.target;
        if(isNaN(value)) return;
        if(!name) return;

        const fieldIndex = name[4];

        const fieldIntIndex = Number(fieldIndex);

        const nextField = document.querySelector(
            `input[name=code${fieldIntIndex + 1}]`
          );
          if (value.length > 1) {
            e.target.value =  value[value.length -1];
          }
      
          if (value.length >= 1 && fieldIntIndex < 6 && nextField !== null) {
            nextField.focus();
          }
        handleChange(e);
    }

    const handleClick = (e) => {
        const { name } = e.target;
        if(!name) return;

        const fieldIndex = name[4];

        const fieldIntIndex = Number(fieldIndex);

        const Field = document.querySelector(
            `input[name=code${fieldIntIndex}]`
        );

        Field.setSelectionRange(1, 1);
    }

    const handleKeyDown = (e, handleChange) => {
        const { name, value } = e.target;
        if(!name) return;

        const fieldIndex = name[4];

        const fieldIntIndex = Number(fieldIndex);

        const prevField = document.querySelector(
            `input[name=code${fieldIntIndex-1}]`
        );
        const Field = document.querySelector(
            `input[name=code${fieldIntIndex}]`
        );
        const nextField = document.querySelector(
            `input[name=code${fieldIntIndex+1}]`
        );

        if(e.key === "Backspace" && value.length === 0 && fieldIntIndex > 0 && prevField != null){
            prevField.focus();
        }
        if(e.key === "ArrowLeft" && prevField != null){
            prevField.focus();
            prevField.setSelectionRange(1, 1);
        }
        Field.setSelectionRange(1, 1);
        if(e.key === "ArrowRight" && nextField != null){
            nextField.focus();
        }

        handleChange(e);
    }
    
  return (
    <>
    {otp.map((value, index) => (
        <Controller
        name={`code${index+1}`}
        key={index}
        control = {control}
        render={({field, fieldState: {error}}) =>(
            <TextField
            {...field}
            error={!!error}
            placeholder="-"
            // helperText={error?.message}
            onChange={(e) => handleChange(e, field.onChange)} 
            onClick={(e) => handleClick(e)}
            onKeyDown= {(e) => handleKeyDown(e, field.onChange)}    
            autoFocus={index === 0}
            InputProps={{
                sx: {
                    width: { xs: 36, sm: 66 },
                    height: { xs: 36, sm: 66 },
                    "& input": { p: 0, textAlign: "center" },
                },
            }}
            inputProps={{
                form: {
                    autocomplete: 'off',
                },
            }}
            />
        )}
        />
    ))}
    
    </>
  )
}

export default RHFCodes