import onChange from 'on-change';
import { render, renderErrors } from '../utils/index';

const view = (state, i18n) => onChange(state, (path) => {
  if (path === 'feeds' || path === 'posts') {
    render(view(state, i18n), i18n);
  }

  if (path === 'errors') {
    renderErrors(view(state, i18n));
  }
});

export default view;
