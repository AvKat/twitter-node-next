import { FieldError } from "../../resolvers/_helpers";
import { Validator } from "./validators";

type Validate<T = string> = (value: T, validators: Validator[]) => FieldError[];

const validateField: Validate = (value, validators) => {
  const errors: FieldError[] = [];

  for (let validator of validators) {
    const err = validator(value);
    if (err) {
      errors.push(err);
    }
  }

  return errors;
};

export { validateField };
