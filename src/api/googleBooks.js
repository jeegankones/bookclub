import axios from 'axios';

const url = 'https://www.googleapis.com/books/v1/volumes';

function getBooks(query) {
    return axios.get(url, {
        params: {
            q: query,
            ...(import.meta.env.VITE_APP_GOOGLE_BOOKS_API_KEY && {
                key: import.meta.env.VITE_APP_GOOGLE_BOOKS_API_KEY,
            }),
        },
    });
}

export { getBooks };
