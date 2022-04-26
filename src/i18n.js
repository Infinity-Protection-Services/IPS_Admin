import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";

import translationGr from "./Assets/locales/gr/translation.json";
import translationIT from "./Assets/locales/it/translation.json";
import translationRS from "./Assets/locales/rs/translation.json";
import translationSP from "./Assets/locales/sp/translation.json";
import translationENG from "./Assets/locales/eng/translation.json";

// the translations
const resources = {
  gr: {
    translation: translationGr,
  },
  it: {
    translation: translationIT,
  },
  rs: {
    translation: translationRS,
  },
  sp: {
    translation: translationSP,
  },
  eng: {
    translation: translationENG,
  },
};
i18n
  .use(detector)
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem('lang'),
    fallbackLng: "en", // use en if detected lng is not available
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n
