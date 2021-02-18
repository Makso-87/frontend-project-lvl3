import controller from './controller';
import view from './view';

const app = () => {
  const state = {
    form: {
      status: '',
      value: '',
    },
    feeds: [
      {
        id: '',
        title: '',
        description: '',
        link: '',
      },
    ],
  };

  controller(view(state));
};

export default app;
