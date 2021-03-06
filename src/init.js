/* eslint-env browser */
import i18n from 'i18next';
import ru from './texts/ru';
import main from './modules/main';
import view from './modules/view';

export default () => {
  const i18nInstance = i18n.createInstance();

  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const state = {
    form: {
      status: 'ready',
      data: {
        link: '',
        responseData: '',
      },
    },
    feeds: [],
    posts: [],
    errors: {},
  };

  document.querySelector('#form')
    .addEventListener('submit', (event) => {
      event.preventDefault();
      const watchedState = view(state, i18nInstance);
      main(event, watchedState, i18nInstance);
    });
};
