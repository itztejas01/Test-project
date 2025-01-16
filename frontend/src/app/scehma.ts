import * as Yup from "yup";

export const userSchema = Yup.object().shape({
  id: Yup.string(),
  name: Yup.string().required("User name is required"),
  email: Yup.string()
    .email("Please enter valid email address")
    .required("Email address is required"),
  date_of_birth: Yup.string(),
  password: Yup.string(),
});

export type TUser = Yup.InferType<typeof userSchema>;

export const listUserSchema = Yup.array().of(userSchema);

export type TUserlist = Yup.InferType<typeof listUserSchema>;
