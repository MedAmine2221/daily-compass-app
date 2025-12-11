import * as yup from "yup";
const chatbotSchema =yup.object().shape({
      prompt: yup.string().required("Prompt is required")
    });
export default chatbotSchema;