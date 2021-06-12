import onChange from 'on-change';
import { render, renderErrors } from '../utils/index';

const view = (state) => onChange(state, (path) => {
  if (path === 'feeds' || path === 'posts') {
    render(state);
  }

  if (path === 'errors') {
    renderErrors(state);
  }
});

export default view;
