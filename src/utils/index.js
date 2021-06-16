/* eslint-env browser */
import _ from 'lodash';
import axios from 'axios';

const checkToUniqURL = (state) => {
  const { link } = state.form.data;
  const { feeds } = state;
  return feeds ? feeds.filter((feed) => feed.link === link) : [];
};

const parseRSS = (data) => {
  const domparser = new DOMParser();
  return domparser.parseFromString(data, 'application/xml');
};

const blockingControls = () => {
  const input = document.querySelector('#inputLink');
  const button = document.querySelector('button[name="add"]');
  input.setAttribute('readonly', 'readonly');
  button.setAttribute('disabled', 'disabled');
};

const unblockingControls = () => {
  const input = document.querySelector('#inputLink');
  const button = document.querySelector('button[name="add"]');
  input.removeAttribute('readonly');
  button.removeAttribute('disabled');
};

const extractItemData = (item) => {
  const itemChildren = Array.from(item.children);
  const [title] = itemChildren.filter((child) => child.tagName === 'title');
  const [link] = itemChildren.filter((child) => child.tagName === 'link');
  const [description] = itemChildren.filter((child) => child.tagName === 'description');
  const items = itemChildren.filter((child) => child.tagName === 'item');

  const result = {
    id: _.uniqueId(),
    title: title.textContent,
    link: link.textContent,
    description: description.textContent,
    visited: false,
  };

  if (items.length) {
    result.items = items;
  }

  return result;
};

const makeNewFeed = (data, link) => {
  const parsedData = parseRSS(data);
  const [rss] = parsedData.children;
  const [channel] = rss.children;
  const normalized = extractItemData(channel);

  return {
    ...normalized,
    items: normalized.items.map((item) => extractItemData(item)),
    link,
  };
};

const showModal = (event, state) => {
  event.preventDefault();
  const target = event.currentTarget;
  const parentId = target.closest('li')
    .getAttribute('id');
  const [post] = state.posts.filter((postItem) => postItem.id === parentId);
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const modalLink = document.querySelector('.modal-footer a');
  const { description } = post;
  const searchIndex = description.search(/<a\shref="[^"]+">(Читать|заинтересовало)[\D]+/gi);
  const endIndex = searchIndex !== -1 ? searchIndex : description.length + 1;
  const descriptionWithoutLink = description.slice(0, endIndex);

  modalTitle.textContent = post.title;
  modalBody.innerHTML = descriptionWithoutLink;
  modalLink.setAttribute('href', post.link);
};

const setVisited = (event, state) => {
  const button = event.currentTarget;
  const currentPostId = button.closest('.list-group-item')
    .getAttribute('id');

  state.posts.forEach((postItem) => {
    if (postItem.id === currentPostId) {
      // eslint-disable-next-line no-param-reassign
      postItem.visited = true;
    }
  });
};

const render = (state, i18n) => {
  const form = document.querySelector('#form');
  const formInput = document.querySelector('#inputLink');
  const feedback = document.querySelector('.feedback');
  const feedsTitle = document.createElement('h2');
  const feedsList = document.createElement('ul');
  const postsTitle = document.createElement('h2');
  const postsList = document.createElement('ul');

  feedsTitle.textContent = i18n.t('feeds.title');
  postsTitle.textContent = i18n.t('posts.title');
  feedsList.classList.add('list-group', 'mb-5');
  postsList.classList.add('list-group', 'mb-5');

  state.feeds.forEach((feed) => {
    const feedListItem = document.createElement('li');
    const feedTitle = document.createElement('h3');
    const feedDescription = document.createElement('p');

    feedTitle.textContent = feed.title;
    feedDescription.textContent = feed.description;
    feedListItem.classList.add('list-group-item');

    feedListItem.append(feedTitle);
    feedListItem.append(feedDescription);
    feedsList.append(feedListItem);
  });

  state.posts.forEach((post) => {
    const postListItem = document.createElement('li');
    const postLink = document.createElement('a');
    const postButton = document.createElement('button');
    const itemLinkClasses = ['text-decoration-none'];

    if (post.visited) {
      itemLinkClasses.push('fw-normal');
    } else {
      itemLinkClasses.push('fw-bold');
    }

    postButton.classList.add('btn', 'btn-primary', 'btn-sm');
    postListItem.classList.add('list-group-item', 'd-flex', 'justify-content-between');
    postListItem.setAttribute('id', post.id);
    postButton.textContent = i18n.t('posts.post.button');
    postLink.textContent = post.title;
    postLink.classList.add(...itemLinkClasses);
    postLink.setAttribute('data-id', post.id);
    postLink.setAttribute('href', post.link);
    postLink.setAttribute('target', '_blank');
    postLink.setAttribute('rel', 'noopener norefer');
    postButton.setAttribute('data-bs-toggle', 'modal');
    postButton.setAttribute('data-bs-target', '#popup');
    postListItem.append(postLink);
    postListItem.append(postButton);
    postsList.append(postListItem);

    postButton.addEventListener('click', (event) => {
      showModal(event, state);
      setVisited(event, state);
    });

    postLink.addEventListener('click', (event) => {
      setVisited(event, state);
    });
  });

  formInput.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  document.querySelector('.feeds-container .feeds').innerHTML = '';
  document.querySelector('.feeds-container .posts').innerHTML = '';

  document.querySelector('.feeds-container .feeds')
    .append(feedsTitle);
  document.querySelector('.feeds-container .feeds')
    .append(feedsList);
  document.querySelector('.feeds-container .posts')
    .append(postsTitle);
  document.querySelector('.feeds-container .posts')
    .append(postsList);

  feedback.textContent = i18n.t('form.success');
  form.reset();
};

const renderErrors = (state) => {
  const feedback = document.querySelector('.feedback');
  const form = document.querySelector('#form');
  const formInput = document.querySelector('#inputLink');
  const [errorText] = _.keys(state.errors)
    .map((item) => state.errors[item])
    .map((item) => item.message);

  feedback.classList.add('text-danger');
  feedback.classList.remove('text-success');

  feedback.textContent = errorText;
  formInput.classList.add('is-invalid');
  form.reset();
};

const updatePosts = (state) => {
  state.feeds.forEach((feed) => {
    axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${feed.link}&disableCache=true`)
      .then((response) => {
        const newFeed = makeNewFeed(response.data.contents, feed.link);

        const [matchedFeed] = state.feeds
          .filter((feedItem) => feedItem.title === newFeed.title);

        newFeed.items.forEach((newPostItem) => {
          const matching = matchedFeed.items
            .filter((existingPost) => existingPost.title === newPostItem.title);

          if (matching.length === 0) {
            state.feeds.forEach((feedItem) => {
              if (feedItem.title === newFeed.title) {
                // console.log('До добавления', state.posts);
                // eslint-disable-next-line no-param-reassign
                feedItem.items = [newPostItem, ...feedItem.items];
                // eslint-disable-next-line no-param-reassign
                state.posts = [newPostItem, ...state.posts];
                // console.log('После добавления', state.posts);
              }
            });
          }
        });
      });
  });

  setTimeout(() => updatePosts(state), 5000);
};

export {
  render, makeNewFeed, renderErrors, updatePosts, showModal,
  setVisited, checkToUniqURL, blockingControls, unblockingControls,
};
