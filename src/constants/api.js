import axios from 'axios'

const api = axios.create({
//baseURL: 'https://smartwave.unitdtechnologies.com:2014',
baseURL:'http://66.29.149.122:2013',
//baseURL: 'http://localhost:3001',
});


// const loginApi = axios.create({
//   baseURL: 'https://art-cause.com:3003'
// });


export default api 