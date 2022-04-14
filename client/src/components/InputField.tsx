import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { FieldHookConfig, useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = FieldHookConfig<string | number> & {
  label: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  inputProps,
  ...props
}) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...inputProps} id={field.name} size="sm" />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export { InputField };
