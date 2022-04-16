import { FieldError } from "../../resolvers/_helpers";
import { validationErrors } from "./errors";

export type Validator<T = string> = (value: T) => FieldError | null;

export const emailValidator: Validator = (email: string) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(email.toLowerCase())) {
    return null;
  }

  return validationErrors.email.invalid;
};

export const usernameValidator: Validator = (username: string) => {
  if (username.length < 4) {
    return validationErrors.length("username", 4);
  }
  const re = /^[a-zA-Z0-9_.]+$/;
  if (!re.test(username.toLowerCase())) {
    return validationErrors.username.invalid;
  }

  return null;
};

export const lengthValidator: (
  length: number,
  field: string,
  name?: string
) => Validator = (length, field, name) => (value: string) => {
  if (value.length < length) {
    return validationErrors.length(field, length, name);
  }
  return null;
};
