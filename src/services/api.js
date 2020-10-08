import axios from 'axios'



const api = axios.create({
    baseURL:'http://192.168.0.103:3000',
    headers:{token:'hardcodedtokenauthorization'}
})


export default api