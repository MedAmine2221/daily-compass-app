import * as yup from "yup";
import { PRIORITY } from "../constants/enums";
import { PRIORITY_TYPE } from "../constants/types";

export const goalSchema = (t: any) =>
  yup.object().shape({
    name: yup.string().required(t("errors.goalNameRequired")),
    description: yup.string().required(t("errors.goalDescriptionRequired")),
    priority: yup
      .mixed<PRIORITY_TYPE>()
      .oneOf(
        [PRIORITY.HIGH, PRIORITY.CRITICAL, PRIORITY.LOW, PRIORITY.MEDIUM],
        t("errors.invalidPriority")
      )
      .required(t("errors.priorityRequired")),
    deadline: yup
      .string()
      .typeError(t("errors.invalidDeadline"))
      .required(t("errors.deadlineRequired"))
      .test(
        "in-future",
        t("errors.deadlineInFuture"),
        function (value) {
          if (!value) return true;
          const today = new Date();
          const start = new Date(value);
          return start >= today;
        }
      ),
  });

export const editProfileWithGoalsSchema = (t: any) =>
  yup.object().shape({
    username: yup.string().required(t("errors.usernameRequired")),
    phoneNumber: yup.string().required(t("errors.phoneNumberRequired")),
    address: yup.string().required(t("errors.addressRequired")),
    goals: yup
      .array()
      .of(goalSchema(t))
      .required(t("errors.goalsRequired")),
  });

export default editProfileWithGoalsSchema;
