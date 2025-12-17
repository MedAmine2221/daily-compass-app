import * as yup from "yup";

export const signupSchema = (t: any) =>
  yup.object().shape({
    username: yup
      .string()
      .min(3, t("errors.usernameMin"))
      .max(15, t("errors.usernameMax"))
      .required(t("errors.usernameRequired")),
    email: yup
      .string()
      .email(t("errors.invalidEmail"))
      .required(t("errors.emailRequired")),
    password: yup
      .string()
      .min(6, t("errors.passwordMin"))
      .max(20, t("errors.passwordMax"))
      .required(t("errors.passwordRequired")),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], t("errors.passwordsNotMatch"))
      .required(t("errors.confirmPasswordRequired")),
  });

export default signupSchema;
