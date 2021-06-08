/* eslint-env browser */
import axios from 'axios';
import _ from 'lodash';
import {
  validateForm, makeNewFeed, renderErrors, updatePosts, showModal,
  setVisited,
} from '../utils/index';

const controller = (state) => {
  const form = document.querySelector('#form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // eslint-disable-next-line no-param-reassign
    state.form.data.link = formData.get('url');

    axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(state.form.data.link)}&disableCache=true`)
      .then((response) => {
        // eslint-disable-next-line no-param-reassign
        state.form.data.responseData = response.data.contents;
        const errors = validateForm(state);

        if (_.isEmpty(errors)) {
          const newFeed = makeNewFeed(response.data.contents, state.form.data.link);
          // eslint-disable-next-line no-param-reassign
          state.feeds = [newFeed, ...state.feeds];
          // eslint-disable-next-line no-param-reassign
          state.posts = [...newFeed.items, ...state.posts];

          setTimeout(() => updatePosts(state), 5000);
          console.log(state);
        } else {
          // eslint-disable-next-line no-param-reassign
          state.errors = errors;
          renderErrors(state);
        }
      });
  });

  const buttons = document.querySelectorAll('.posts .list-group li button');

  if (buttons.length) {
    Array.from(buttons)
      .forEach((button) => {
        const link = button.closest('.list-group-item').querySelector('a');

        button.addEventListener('click', (event) => {
          showModal(event, state);
          setVisited(event, state);
        });

        link.addEventListener('click', (event) => {
          setVisited(event, state);
        });
      });
  }
};

export default controller;
