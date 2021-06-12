import i18n from 'i18next';
import onChange from 'on-change';
import controller from './controller';
import ru from '../texts/ru';
import { render, renderErrors } from '../utils';

const app = () => {
  i18n.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  })
    .catch((err) => console.error(err))
    .then((res) => console.log(res));

  const state = {
    form: {
      status: '',
      data: {
        link: '',
        responseData: '',
      },
    },
    feeds: [],
    posts: [],
    errors: {},
  };

  const watchedState = onChange(state, (path) => {
    if (path === 'feeds' || path === 'posts') {
      render(watchedState);
    }

    if (path === 'errors') {
      renderErrors(watchedState);
    }
  });

  controller(watchedState);
};

export default app;
