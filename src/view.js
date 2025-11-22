import { ERROR_CODES, ERROR_MESSAGES } from "./errors.js";

const render = async(state, i18next) => {
    const urlInput = document.querySelector('#url-input');
    const button = document.querySelector('button[type="submit"]');
    const feedback = document.querySelector('.feedback');
   
    // обновляю в состоянии url
   if (state.url !== undefined) {
    urlInput.value = state.url;
   };
   
   // очищаю инпут и поле feedback
   urlInput.classList.remove('is-valid', 'is-invalid');
   feedback.textContent = '';
   feedback.classList.remove('text-danger', 'text-success');
    
   // явно выделяю состояние и в зависимости от него меняется отображение (инпут(границы), 
   // кнопка и фидбек с изменением цвета шрифта)
    if (state.stateProcess.process === 'filling') {
        button.disabled = false;
    }
    if (state.stateProcess.process === 'success') {
        button.disabled = false;
        urlInput.value = '';
        urlInput.classList.add('is-valid');
        urlInput.focus();
        feedback.textContent = i18next.t(ERROR_MESSAGES[ERROR_CODES.SUCCESS]);
        feedback.classList.add('text-success');
    } 
    if (state.stateProcess.process === 'error') {
        button.disabled = false;
        urlInput.classList.add('is-invalid');
        const messageKey = i18next.t(ERROR_MESSAGES[state.stateProcess.errorCode]);
        feedback.textContent = i18next.t(messageKey);
        feedback.classList.add('text-danger');
    }
};

export default render;






