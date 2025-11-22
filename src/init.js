import * as yup from 'yup';
import i18next from 'i18next';
import render from './view.js';
import watcherState from './state.js';
import resources from './locales/index.js';
import { ERROR_CODES, ERROR_MESSAGES } from './errors.js';


/*yup.setLocale({
    string: {
        url: 'url must be a valid url',
    },
});*/

// создаю шаблон-схему валидации
const schema = yup.object().shape({
  website: yup.string().url().required('url must be a valid url').trim().lowercase(),
});


// функция проверки валидности введенного url
const validateURL = async (url) => {
  try {
    await schema.validate({ website: url });
    return { valid: true, code: ERROR_CODES.SUCCESS };
  } catch (error) {
    return { valid: false, code: ERROR_CODES.INVALID_URL };
  }
};

// основная логика с обработчиком
const app = async () => {
    // инициализирую библиотеку i18next
    const i18nextInstance = i18next.createInstance();
    await i18nextInstance.init({
      lng: 'ru',
      debug: true,
      resources,
    });
    const form = document.querySelector('.rss-form');
    const urlInput = document.querySelector('#url-input');
    //const button = document.querySelector('button[type="submit"]');
    //const feedback = document.querySelector('.feedback');
    
    // обработчик 
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // проверяю валидность введенного url и обновляю состояние
        const currentURL = urlInput.value.trim();
        watcherState.url = currentURL;
        
        const { valid, code } = await validateURL(currentURL);
        if (!valid) {
            watcherState.stateProcess.process = 'error';
            watcherState.stateProcess.errorCode = code;
        } else if (watcherState.savedURLs.includes(currentURL)) {
            watcherState.stateProcess.process = 'error';
            watcherState.stateProcess.errorCode = ERROR_CODES.DUPLICATE_URL;
        } else {
         watcherState.savedURLs.push(currentURL);
         watcherState.stateProcess.process = 'success';
         watcherState.stateProcess.errorCode = ERROR_CODES.SUCCESS;
        }
        
        // отображаю состояние
        // очищаю инпут, ставлю фокус
        await render(watcherState, i18nextInstance);
        urlInput.value = '';
        urlInput.focus();
    });
};

export default app;