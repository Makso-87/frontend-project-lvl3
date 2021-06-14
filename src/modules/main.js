/* eslint-env browser */
import axios from 'axios';
import _ from 'lodash';
import {
  makeNewFeed, renderErrors, updatePosts,
} from '../utils/index';
import { validateRSS, validateForm } from './validators';

const main = (event, state, i18n) => {
  const formData = new FormData(event.target);
  // eslint-disable-next-line no-param-reassign
  state.form.data.link = formData.get('url');
  const errors = validateForm(state, i18n);

  if (_.isEmpty(errors)) {
    axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${state.form.data.link}&disableCache=true`)
      .then((response) => {
        // eslint-disable-next-line no-param-reassign
        state.form.data.responseData = response.data.contents;
        // console.log(response);
        const errorsAfterFetch = validateRSS(state, i18n);

        if (_.isEmpty(errorsAfterFetch)) {
          const newFeed = makeNewFeed(response.data.contents, state.form.data.link);
          // eslint-disable-next-line no-param-reassign
          state.feeds = [newFeed, ...state.feeds];
          // eslint-disable-next-line no-param-reassign
          state.posts = [...newFeed.items, ...state.posts];

          setTimeout(() => updatePosts(state), 5000);
          // console.log(state);
        } else {
          // eslint-disable-next-line no-param-reassign
          state.errors = errorsAfterFetch;
          renderErrors(state);
        }
      });
  } else {
    // eslint-disable-next-line no-param-reassign
    state.errors = errors;
    renderErrors(state);
  }
};

export default main;
