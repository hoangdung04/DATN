// ===================================================
// Cart Utils - Logic giỏ hàng với localStorage
// Chuyển từ: public/js/script.js (phần Giỏ hàng)
// ===================================================

// Khởi tạo giỏ hàng nếu chưa có
export const initCart = () => {
  const cart = localStorage.getItem("cart");
  if (!cart) {
    localStorage.setItem("cart", JSON.stringify([]));
  }
};

// Lấy giỏ hàng từ localStorage
export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

// Lưu giỏ hàng vào localStorage
export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Thêm tour vào giỏ hàng
// Chuyển từ: formAddToCart.addEventListener("submit", ...) trong script.js
export const addToCart = (tourId, quantity) => {
  const cart = getCart();
  const existItem = cart.find(item => item.tourId === tourId);

  if (existItem) {
    // Tour đã có → cộng thêm số lượng
    existItem.quantity = existItem.quantity + quantity;
  } else {
    // Tour chưa có → thêm mới
    cart.push({ tourId, quantity });
  }

  saveCart(cart);
  return cart;
};

// Xóa tour khỏi giỏ hàng
// Chuyển từ: eventDeleteItem() trong script.js
export const removeFromCart = (tourId) => {
  const cart = getCart();
  const newCart = cart.filter(item => item.tourId !== tourId);
  saveCart(newCart);
  return newCart;
};

// Cập nhật số lượng tour trong giỏ hàng
// Chuyển từ: eventUpdateQuantityItem() trong script.js
export const updateCartQuantity = (tourId, quantity) => {
  const cart = getCart();
  const existItem = cart.find(item => item.tourId === tourId);
  if (existItem && quantity > 0) {
    existItem.quantity = quantity;
    saveCart(cart);
  }
  return cart;
};

// Đếm số lượng tour trong giỏ hàng (hiển thị mini-cart)
// Chuyển từ: showMiniCart() trong script.js
export const getCartCount = () => {
  return getCart().length;
};

// Xóa toàn bộ giỏ hàng (sau khi đặt tour thành công)
export const clearCart = () => {
  saveCart([]);
};
