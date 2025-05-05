import axios from 'axios';

const axiosClient = axios.create({
  baseURL:"http://localhost:5000/", // 🔁 Replace with your actual API URL
  headers: {
    'Content-Type': 'application/json',
    // Add other headers if needed
  },
  timeout: 5000, // Optional: set timeout (in ms)
});

export default axiosClient;
