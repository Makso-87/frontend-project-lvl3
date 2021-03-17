import i18n from 'i18next';
import controller from './controller';
import view from './view';
import ru from '../texts/ru';

const app = () => {
  i18n.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const state = {
    form: {
      status: '',
      data: {
        link: '',
        responseData: '',
      },
    },
    feeds: [],
    errors: {},
  };

  controller(view(state));
};

export default app;
