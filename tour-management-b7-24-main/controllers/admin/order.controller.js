import Order from "../../models/order.model.js";
import OrderItem from "../../models/order-item.model.js";
import sequelize from "../../config/database.js";
import Tour from "../../models/tour.model.js";

// [GET] /api/admin/orders
export const index = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { deleted: false },
      order: [['createdAt', 'DESC']],
      raw: true,
    });
    
    // TỐI ƯU HÓA: Dùng SQL để gom nhóm và tính toán tổng tiền, tổng tour cho từng đơn hàng
    // Điều này giúp tránh việc dùng vòng lặp For chọc vào DB (Lỗi N+1 Query)
    const [orderStats] = await sequelize.query(`
      SELECT 
        o.id as orderId, 
        COUNT(oi.id) as totalTours, 
        SUM(oi.quantity * (oi.price * (1 - oi.discount / 100))) as total_price
      FROM orders o
      LEFT JOIN orders_item oi ON o.id = oi.orderId
      WHERE o.deleted = false
      GROUP BY o.id
    `);

    // Ghép số liệu vào danh sách orders
    for (const order of orders) {
      const stat = orderStats.find(s => s.orderId === order.id);
      order.totalTours = stat ? stat.totalTours : 0;
      order.total_price = stat ? stat.total_price : 0;
    }

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// [PATCH] /api/admin/orders/:id/status
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Order.update({ status }, { where: { id: req.params.id } });
    res.json({ code: "success", message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};
