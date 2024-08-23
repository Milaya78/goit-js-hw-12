import axios from 'axios';

export async function fetchGallery(query, page = 1, perPage = 15) {
  const url = 'https://pixabay.com/api/';

  const params = new URLSearchParams({
    key: '45077635-6eb8c9a3980485254b901d63b',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: perPage,
  });

  try {
    const response = await axios.get(`${url}?${params}`);
    return response.data;
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: error.message,
      position: 'center',
    });
  }
}
