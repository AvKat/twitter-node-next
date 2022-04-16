import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type InputFieldProps = (
  | InputHTMLAttributes<HTMLInputElement>
  | TextareaHTMLAttributes<HTMLTextAreaElement>
) & {
  label: string;
  textarea?: boolean;
  name: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea = false,
  ...props
}) => {
  const [field, { error }] = useField(props);
  const InputOrTextArea = textarea ? Textarea : Input;
  let placeholder = label;

  if (props.placeholder) {
    placeholder = props.placeholder;
  }

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextArea
        {...(field as any)}
        {...props}
        id={field.name}
        size="sm"
        placeholder={placeholder}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export { InputField };
