import * as yup from 'yup';
import _ from 'lodash';

const schema = yup.object().shape({
  link: yup.string(),
});

const parseRSS = () => {

};

const validateForm = (field) => {
  try {
    schema.validateSync(field);
    return {};
  } catch (error) {
    return _.keyBy(error.inner, 'path');
  }
};

const render = () => {

};

export { parseRSS, validateForm, render };
