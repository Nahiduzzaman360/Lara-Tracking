import axios from "axios";


const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}`
})

axiosClient.interceptors.response.use(response => {
    return response;
  }, error => {
    throw error;
  })
  
export default axiosClient;