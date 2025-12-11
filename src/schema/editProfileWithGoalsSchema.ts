import * as yup from "yup";
import { PRIORITY } from "../constants/enums";
import { PRIORITY_TYPE } from "../constants/types";

const goalSchema = yup.object().shape({
  name: yup.string().required("Goal name is required"),
  description: yup.string().required("Goal description is required"),
  priority: yup
    .mixed<PRIORITY_TYPE>()
    .oneOf([PRIORITY.HIGH, PRIORITY.CRITICAL, PRIORITY.LOW, PRIORITY.MEDIUM], "Invalid priority")
    .required("Priority is required"),
  deadline: yup
    .string()
    .typeError("Deadline must be a valid date")
    .required("Deadline is required")
    .test(
      "in-future",
      "deadline must be in the future",
      function (value) {
        if (!value) return true;
        const today = new Date();
        const start = new Date(value);
        return start >= today;
      }
    ),
});

const editProfileWithGoalsSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required"),
  address: yup.string().required("Address is required"),
  goals: yup
    .array()
    .of(goalSchema)
    .required("Goals are required"),
});

export default editProfileWithGoalsSchema;
