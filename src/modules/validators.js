import * as yup from 'yup';
import { setLocale } from 'yup';
import _ from 'lodash';
import { checkToUniqURL } from '../utils';

const validateForm = (state, i18n) => {
  setLocale({
    string: {
      url: i18n.t('form.errors.notValidURL'),
      min: i18n.t('form.errors.notFilled'),
    },
    array: {
      length: i18n.t('form.errors.notUnique'),
    },
  });

  const schema = yup.object()
    .shape({
      field: yup.string()
        .min(1),
      url: yup.string()
        .url(),
      unique: yup.array()
        .length(0),
    });

  const checkingFields = {
    field: state.form.data.link,
    url: state.form.data.link,
    unique: checkToUniqURL(state),
  };

  try {
    schema.validateSync(checkingFields, { abortEarly: false });
    return {};
  } catch (error) {
    return _.keyBy(error.inner, 'path');
  }
};

const validateRSS = (state, i18n) => {
  setLocale({
    string: {
      matches: i18n.t('form.errors.notRSS'),
    },
  });

  const schema = yup.object()
    .shape({
      response: yup.string()
        .matches(/<\/rss>/),
    });

  const checkingFields = {
    response: state.form.data.responseData,
  };

  try {
    schema.validateSync(checkingFields, { abortEarly: false });
    return {};
  } catch (error) {
    return _.keyBy(error.inner, 'path');
  }
};

const validateNet = (state, i18n) => {
  setLocale({
    mixed: {
      notOneOf: i18n.t('form.errors.notNet'),
    },
  });

  const schema = yup.object()
    .shape({
      netError: yup.string().required().notOneOf(['Network Error']),
    });

  const checkingFields = {
    netError: state.form.data.responseData,
  };

  try {
    schema.validateSync(checkingFields, { abortEarly: false });
    return {};
  } catch (error) {
    return _.keyBy(error.inner, 'path');
  }
};

export { validateForm, validateRSS, validateNet };
