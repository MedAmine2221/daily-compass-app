import * as yup from 'yup';
import 'yup-phone-lite';
const forgotPasswordSchema = yup.object().shape({
      email: yup.string().email("Invalid email").required("Email is required"),
});
export default forgotPasswordSchema;