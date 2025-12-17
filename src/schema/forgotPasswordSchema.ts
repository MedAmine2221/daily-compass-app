import * as yup from 'yup';
import 'yup-phone-lite';

export const forgotPasswordSchema = (t: any) =>
  yup.object().shape({
    email: yup
      .string()
      .email(t("errors.invalidEmail"))
      .required(t("errors.emailRequired")),
  });

export default forgotPasswordSchema;
