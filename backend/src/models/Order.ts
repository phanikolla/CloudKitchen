import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'delivered'], default: 'pending' },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  paymentId: { type: String, required: true },
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema); 