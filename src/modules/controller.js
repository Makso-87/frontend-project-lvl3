import { validateForm, parseRSS } from '../utils/index';
import _ from 'lodash';
import axios from 'axios';

const controller = (state) => {
  const form = document.querySelector('#form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const link = formData.get('link');

    if (_.isEmpty(validateForm(link))) {
      state.form.value = link;

      axios.get(state.form.value)
        .then((response) => {
          console.log(response);
        });
    }

    console.log(state.form.value);
  });
};

export default controller;
