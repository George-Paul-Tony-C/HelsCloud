// models/Order.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
    },
  },
  { timestamps: true } // This will create `createdAt` and `updatedAt` fields
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
