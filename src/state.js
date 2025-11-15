import onChange from "on-change";
import render from './view.js';

// определяю начальное состояние
const state = {
    url: '',
    savedURLs: [],
    stateProcess: {
        process: 'filling', //'filling', 'valid', 'errorInvalid', 'errorDouble' 
        error: null,
    } 
};

// создаю вотчер на объект state --> далее в input.js отработаю логику:
// "меняется состояние --> вотчер отслеживает --> автоматически меняется отображение"
const watcherState = onChange(state, (path) => {
    render(watcherState);
});

export default watcherState;


//inputForm: {
        //value: '',
        //valid: null, //true, false
        //feedback: '',
    //},