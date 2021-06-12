/* eslint-env browser */
import axios from 'axios';
import _ from 'lodash';
import {
  validateForm, makeNewFeed, renderErrors, updatePosts, validateRSS,
} from '../utils/index';

const controller = (state) => {
  const form = document.querySelector('#form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // eslint-disable-next-line no-param-reassign
    state.form.data.link = formData.get('url');
    const errors = validateForm(state);

    if (_.isEmpty(errors)) {
      axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${state.form.data.link}&disableCache=true`)
        .then((response) => {
          // eslint-disable-next-line no-param-reassign
          state.form.data.responseData = response.data.contents;
          const errorsAfterFetch = validateRSS(state);

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
  });
};

export default controller;
