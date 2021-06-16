import onChange from 'on-change';
import {
  blockingControls, render, renderErrors, unblockingControls,
} from '../utils/index';

const view = (state, i18n) => onChange(state, (path) => {
  if (path === 'feeds' || path === 'posts') {
    render(view(state, i18n), i18n);
  }

  if (path === 'form.status') {
    if (state.form.status === 'starting') {
      blockingControls();
    } else if (state.form.status !== 'loading') {
      unblockingControls();
    }
  }

  if (path === 'errors') {
    renderErrors(view(state, i18n));
  }
});

export default view;
