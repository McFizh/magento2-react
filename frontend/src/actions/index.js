import axios from 'axios';

const ROOT_URL = 'http://localhost:3080';

// ::::::::::::::::::::

export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';

// ::::::::::::::::::::

export function fetchCategoryData() {
    const url = `${ROOT_URL}/api/categories`;
    const request = axios.get(url);

    return {
        type: FETCH_CATEGORIES,
        payload: request
    };
}

