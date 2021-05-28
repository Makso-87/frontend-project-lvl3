import onChange from 'on-change';
import { render, renderErrors } from '../utils/index';
import controller from './controller';

const view = (state) => onChange(state, (path) => {
  if (path === 'feeds' || path === 'posts') {
    render(state);
  }

  if (path === 'errors') {
    renderErrors(state);
  }

  controller(view(state));
});

export default view;
