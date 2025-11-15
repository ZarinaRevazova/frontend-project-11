import * as yup from 'yup';
import render from './view.js';
import watcherState from './state.js';

// создаю шаблон-схему валидации
const schema = yup.object().shape({
  website: yup.string().url().required('url must be a valid url').trim().lowercase(),
});


// функция проверки валидности введенного url
const validateURL = async (url) => {
    try {
        await schema.validate({ website: url });
        return true;
    } catch (error) {
        return false;
    }
};

// основная логика с обработчиком
const app = async () => {
    const form = document.querySelector('.rss-form');
    const urlInput = document.querySelector('#url-input');
    //const button = document.querySelector('button[type="submit"]');
    //const feedback = document.querySelector('.feedback');
    
    // обработчик 
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // проверяю валидность введенного url и обновляю состояние
        const currentURL = urlInput.value.trim();
        const isValid = await validateURL(currentURL);
        watcherState.url = currentURL;
        
        if (isValid) {
            // проверяю является ли введенный url дубликатом
            const existingURL = watcherState.savedURLs.find((url) => url === currentURL);
            if (existingURL) {
                watcherState.stateProcess.process = 'errorDouble';
            } else {
                watcherState.stateProcess.process = 'valid';
                watcherState.savedURLs.push(currentURL);
            }
        } else {
            watcherState.stateProcess.process = 'errorInvalid';
        }
        
        // отображаю состояние
        // очищаю инпут, ставлю фокус
        await render(watcherState);
        urlInput.value = '';
        urlInput.focus();
    });
};

export default app;