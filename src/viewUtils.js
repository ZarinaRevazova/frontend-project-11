const feedsBlock = (state, feeds) => {
  const divBorder = document.createElement('div');
  const divBody = document.createElement('div');
  const h2 = document.createElement('h2');
  const ul = document.createElement('ul');

  divBorder.classList.add('card', 'border-0');
  divBody.classList.add('card-body');
  h2.classList.add('card-title', 'h4');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  divBorder.appendChild(divBody);
  divBody.appendChild(h2);
  divBorder.appendChild(ul);

  h2.textContent = 'Фиды';

  state.feeds.forEach((feed) => {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const p = document.createElement('p');

    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    h3.classList.add('h6', 'm-0');
    p.classList.add('m-0', 'small', 'text-black-50');

    li.appendChild(h3);
    li.appendChild(p);

    h3.textContent = feed.title;
    p.textContent = feed.description;

    ul.appendChild(li);
  });

  feeds.appendChild(divBorder);
};

const postsBlock = (state, posts) => {
  const divBorder = document.createElement('div');
  const divBody = document.createElement('div');
  const h2 = document.createElement('h2');
  const ul = document.createElement('ul');

  divBorder.classList.add('card', 'border-0');
  divBody.classList.add('card-body');
  h2.classList.add('card-title', 'h4');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  divBorder.appendChild(divBody);
  divBorder.appendChild(ul);
  divBody.appendChild(h2);

  h2.textContent = 'Посты';

  state.posts.forEach((post) => {
    const {
      id, link, title,
    } = post;

    if (!title || !link) {
      return;
    }
    const li = document.createElement('li');
    const a = document.createElement('a');
    const button = document.createElement('button');

    // list-group-item d-flex justify-content-between align-items-start border-0 border-end-0
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    // href="http://example.com/test/1769299200" class="fw-bold" data-id="2" target="_blank" rel="noopener noreferrer"
    ul.appendChild(li);
    li.appendChild(a);
    li.appendChild(button);

    a.classList.add('fw-bold');
    a.href = link;
    a.dataset.id = id;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';

    // eslint-disable-next-line max-len
    // type="button" class="btn btn-outline-primary btn-sm" data-id="2" data-bs-toggle="modal" data-bs-target="#modal"
    button.type = 'button';
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.dataset.id = id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';

    a.textContent = title;
    button.textContent = 'Просмотр';
  });
  posts.appendChild(divBorder);
};

const modalBlock = (state, modalId) => {
  const divModal = document.querySelector('#modal');
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');

  modalTitle.textContent = '';
  modalBody.textContent = '';

  divModal.removeAttribute('aria-hidden');
  divModal.setAttribute('aria-modal', 'true');
  divModal.setAttribute('style', 'display: block;');
  divModal.classList.add('show');

  state.posts.forEach((post) => {
    const {
      id, title, description,
    } = post;
    if (id === modalId) {
      modalTitle.textContent = title;
      modalBody.textContent = description;
    }
  });
};

const updateReadedLinks = (state) => {
  state.posts.forEach((post) => {
    const { id, link } = post;
    const linkElement = document.querySelector(`a[href="${link}"]`);
    if (state.uiState.visitedLinks.has(id)) {
      linkElement.classList.remove('fw-bold');
      linkElement.classList.add('fw-normal');
    }
  });
};

export {
  feedsBlock, postsBlock, modalBlock, updateReadedLinks,
};
