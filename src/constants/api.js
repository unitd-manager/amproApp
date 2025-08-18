import axios from 'axios'

const api = axios.create({
//baseURL: 'https://amproadmin.zaitunsoftsolutions.com:2002',
baseURL: 'http://66.29.149.122:2001',
});

export default api