import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export function RHFTextField({
  label,
  inputProps,
  name,
  control,
  errors,
  type,
  disabled
}) {
  return (
    <FormControl fullWidth sx={{ mb: "1rem" }}>
      <Controller
        name={name}
        disabled={disabled}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            required
            label={label}
            InputProps={inputProps}
            error={errors ? true : false}
            helperText={errors ? errors?.message : ""}
            type={type}
          />
        )}
      />
    </FormControl>
  );
}
