import onChange from 'on-change';

const view = (state) => {
  const watchedState = onChange(state, (path, value) => {
    // console.log(state);
  });

  return watchedState;
};

export default view;
