// ===================================================
// API Service - Gọi API từ backend TypeScript (port 3000)
// ===================================================
import axios from 'axios';

// Config axios - baseURL trỏ tới backend TypeScript
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// ========================
// CLIENT APIs
// ========================

// Lấy danh sách danh mục (active)
// Tương ứng Pug: categories/index.pug gọi từ controller
export const getCategories = () => api.get('/categories');

// Lấy danh sách tour theo danh mục (slug)
// Tương ứng Pug: tours/index.pug - each item in tours
export const getToursByCategory = (slugCategory) => api.get(`/tours/${slugCategory}`);

// Lấy chi tiết 1 tour
// Tương ứng Pug: tours/detail.pug - tourDetail
export const getTourDetail = (slugTour) => api.get(`/tours/detail/${slugTour}`);

// Lấy thông tin giỏ hàng (gửi cart từ localStorage)
// Tương ứng: POST /cart/list trong script.js
export const getCartList = (cart) => api.post('/cart/list', cart);

// Đặt tour (gửi info + cart)
// Tương ứng: POST /order trong script.js
export const createOrder = (data) => api.post('/order', data);

// Lấy thông tin đơn hàng thành công
// Tương ứng Pug: order/success.pug
export const getOrderSuccess = (orderCode) => api.get(`/order/success?orderCode=${orderCode}`);

// ========================
// ADMIN APIs
// ========================

// Admin: Lấy danh sách tour
// Tương ứng Pug: admin/pages/tours/index.pug
export const getAdminTours = () => api.get('/admin/tours');

// Admin: Lấy danh sách danh mục
// Tương ứng Pug: admin/pages/categories/index.pug
export const getAdminCategories = () => api.get('/admin/categories');

// Admin: Lấy danh mục cho form tạo tour
// Tương ứng Pug: admin/pages/tours/create.pug - each item in categories
export const getAdminTourCategories = () => api.get('/admin/tours/categories');

// Admin: Tạo tour mới (gửi FormData vì có upload ảnh)
// Tương ứng: POST /admin/tours/create trong form
export const createAdminTour = (formData) => api.post('/admin/tours/create', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default api;
