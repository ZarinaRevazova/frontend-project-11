const render = async(state) => {
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
    if (state.stateProcess.process === 'valid') {
        button.disabled = false;
        urlInput.value = '';
        urlInput.classList.add('is-valid');
        urlInput.focus();
        feedback.textContent = 'RSS успешно загружен';
        feedback.classList.add('text-success');
    } 
    if (state.stateProcess.process === 'errorInvalid') {
        button.disabled = false;
        urlInput.classList.add('is-invalid');
        feedback.textContent = 'Ссылка должна быть валидным URL';
        feedback.classList.add('text-danger');
    }  
    if (state.stateProcess.process === 'errorDouble') {
        button.disabled = false;
        urlInput.classList.add('is-invalid');
        feedback.textContent = 'RSS уже существует';
        feedback.classList.add('text-danger');
    }

};

export default render;






