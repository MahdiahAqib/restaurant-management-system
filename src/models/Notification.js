import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'reservation_created',
      'reservation_updated',
      'reservation_cancelled',
      'order_received',
      'order_cancelled',
      'table_reserved',
      'table_unreserved'
    ],
  },
  message: {
    type: String,
    required: true,
  },
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema); 