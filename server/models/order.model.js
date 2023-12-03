import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    status: {
      type: String,
      default: 'reserved'
    },
    dateReserved: {
      type: Date
    },
    reserveDueDate: {
      type: Date
    },
    dateBorrowed: {
      type: Date
    },
    returnDueDate: {
      type: Date
    },
    dateReturned: {
      type: Date
    }
  },
);

const Order = model('Order', orderSchema);
export default Order;