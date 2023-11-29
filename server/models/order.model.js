import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
  {
    bookRefID: {
      type: Schema.Types.bookRefID,
      ref: 'Book',
      required: true
    },
    universityID: {
      type: Schema.Types.universityID,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      default: 'reserved'
    }
  },
  {
    timestamps: true
  }
);

const Order = model('Order', orderSchema);
export default Order;