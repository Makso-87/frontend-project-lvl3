/* eslint-env browser */
import axios from 'axios';
import _ from 'lodash';
import {
  validateForm, makeNewFeed, renderErrors, updatePosts,
} from '../utils/index';

const controller = (state) => {
  const form = document.querySelector('#form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    state.form.data.link = formData.get('link');
    console.log(formData);

    axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(state.form.data.link)}`)
      .then((response) => {
        state.form.data.responseData = response.data.contents;
        const errors = validateForm(state);

        if (_.isEmpty(errors)) {
          const newFeed = makeNewFeed(response.data.contents, state.form.data.link);
          state.feeds.push(newFeed);

          setTimeout(() => {
            updatePosts(state);
          }, 5000);
        } else {
          state.errors = errors;
          renderErrors(state);
        }
      });
  });
};

export default controller;
