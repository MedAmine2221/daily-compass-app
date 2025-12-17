import * as yup from "yup";

export const loginSchema = (t: any) =>
  yup.object().shape({
    email: yup
      .string()
      .email(t("errors.invalidEmail"))
      .required(t("errors.emailRequired")),
    password: yup
      .string()
      .required(t("errors.passwordRequired")),
  });

export default loginSchema;
