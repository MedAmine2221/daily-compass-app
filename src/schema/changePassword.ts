import * as yup from "yup";

export const changePassSchema = (t: any) =>
  yup.object().shape({
    oldPassword: yup
      .string()
      .min(6, t("errors.changePassword.passwordMin"))
      .max(20, t("errors.changePassword.passwordMax"))
      .required(t("errors.changePassword.oldPasswordRequired")),

    newPassword: yup
      .string()
      .min(6, t("errors.changePassword.passwordMin"))
      .max(20, t("errors.changePassword.passwordMax"))
      .required(t("errors.changePassword.newPasswordRequired")),

    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], t("errors.changePassword.passwordNotMatch"))
      .required(t("errors.changePassword.confirmPasswordRequired")),
  });
