import axios from 'axios';

// Membuat instance Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Menyisipkan Token JWT di Header secara Otomatis
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: Mempersingkat data response & Logout jika token mati
api.interceptors.response.use(
  (response) => {
    // Mengembalikan response data langsung (biar di page cukup panggil result.data)
    return response.data;
  },
  (error) => {
    // Tangani token kadaluarsa (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect ke login jika tidak sedang di halaman login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Kembalikan objek error agar bisa di-catch oleh komponen React
    return Promise.reject(error.response ? error.response.data : error);
  }
);

export default api;
