import onChange from 'on-change';
import { render, renderErrors } from '../utils/index';

const view = (state) => {
  const watchedState = onChange(state, (path) => {
    if (path === 'feeds') {
      // console.log(state.feeds);
      render(state.feeds);
    }

    if (path === 'errors') {
      renderErrors(state);
    }
  });

  return watchedState;
};

export default view;
