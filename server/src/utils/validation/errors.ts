enum Fields {
  username = "username",
  email = "email",
  usernameOrEmail = "usernameOrEmail",
  password = "password",
}

export const validationErrors = {
  username: {
    invalid: {
      field: Fields.username,
      message:
        "Username can only contain letters, numbers, underscores(_) and periods (.)",
    },
    duplicate: {
      field: Fields.username,
      message: "Username already in use",
    },
  },
  email: {
    invalid: {
      field: Fields.email,
      message: "Invalid email",
    },
    duplicate: {
      field: Fields.email,
      message: "Email already in use",
    },
  },
  usernameOrEmail: {
    notExists: {
      field: Fields.usernameOrEmail,
      message: "The user does not exist",
    },
  },
  password: {
    incorrect: {
      field: Fields.password,
      message: "Incorrect password",
    },
  },
  length: (field: string, min: number) => ({
    field,
    message: `${field} must be more than ${min} characters`,
  }),
} as const;
