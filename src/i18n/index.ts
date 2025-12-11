import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEn from "./locales/en-US/translation.json";
import translationFr from "./locales/fr-FR/translation.json";

const resources = {
  "fr-FR": { translation: translationFr },
  "en-US": { translation: translationEn },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem("language");

  if (!savedLanguage) {
    savedLanguage = Localization.locale;
  }

  // eslint-disable-next-line import/no-named-as-default-member
  i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    resources,
    lng: savedLanguage,
    fallbackLng: "fr-FR",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;