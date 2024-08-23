export function renderGallery(images) {
  const gallery = document.querySelector('.gallery');
  const markup = images
    .map(image => {
      return `<li>
                <a href="${image.largeImageURL}">
                  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                </a>
                <ul class="info">
                  <li><span>Likes:</span> ${image.likes}</li>
                  <li><span>Views:</span> ${image.views}</li>
                  <li><span>Comments:</span> ${image.comments}</li>
                  <li><span>Downloads:</span> ${image.downloads}</li>
                </ul>
              </li>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}
