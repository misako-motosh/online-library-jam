import Order from '../models/order.model.js';
// import Book from '../models/book.model.js';
// import User from '../models/book.model.js';

export const getOrders = async (request, response) => {
  try {
    // const orders = (await) Insert code that extracts the order from the database based on user token. Populate with book title, author, image, nameOfBorrower, universityIDOfBorrower, reservationCountdown, returnCountdown

    const orders = await Order
      .find()
      .populate({
        path: 'userId',
        select: 'universityID email'
      })
      .populate({
        path: 'bookId',
        select: 'bookRefID title author shelfLocation'
      })
      .exec();

    response.status(200).send({
      message: `List of orders for: (user ____)`,
      data: orders
    })

  } catch (error) {
    console.error(error);
    response.send(error.message);
  }
};

export const createOrder = async (request, response) => {
  // add validation. an order cannot be created when book status is reserved, borrowed
  // an order can be created if book status is available 

  try {
    let order = new Order({
      userId: request.body.userId,
      bookId: request.body.bookId,
    })
  
    await order.save();

    response.status(200).send({
      message: `Order created! Be sure to pick the book within 1 day`,
      data: order
    })

  } catch (error) {
    console.error(error);
    response.send(error.message);
  }
}

export const updateOrder = async (request, response) => {
  // add timer functionality
  // if status is reserved, update to borrowed
  // if status is borrowed, update to returned

  try {
    const { id } = request.params;

    const order = await Order.findOneAndUpdate(
      { _id: id },
      { $set: { status: 'borrowed' } },
      { new: true }
      );

    if (!order) {
      response.status(404).send({
        message: `Order ID no: ${id} not found.`
      })
    } else {
      response.status(200).send({
        message: `Order ID no: ${id} has already been picked up by the borrower.`,
        data: order
      })
    }
  } catch (error) {
    console.error(error);
    response.send(error.message);
  }
}