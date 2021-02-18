import axios from 'axios';
import _ from 'lodash';
import { validateForm, parseRSS } from '../utils/index';

const controller = (state) => {
  // eslint-disable-next-line no-undef
  const form = document.querySelector('#form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-undef
    const formData = new FormData(e.target);
    const link = formData.get('link');

    if (_.isEmpty(validateForm(link))) {
      // eslint-disable-next-line no-param-reassign
      state.form.value = link;

      axios.get(state.form.value)
        .then((response) => {
          console.log(response);
        });

      parseRSS();
    }

    console.log(state.form.value);
  });
};

export default controller;
