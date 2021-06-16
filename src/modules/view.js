import onChange from 'on-change';
import {
  removeReadonly, render, renderErrors, setReadonly,
} from '../utils/index';

const view = (state, i18n) => onChange(state, (path) => {
  if (path === 'feeds' || path === 'posts') {
    render(view(state, i18n), i18n);
  }

  if (path === 'form.status') {
    if (state.form.status === 'starting') {
      setReadonly();
    } else if (state.form.status !== 'loading') {
      removeReadonly();
    }
  }

  if (path === 'errors') {
    renderErrors(view(state, i18n));
  }
});

export default view;
