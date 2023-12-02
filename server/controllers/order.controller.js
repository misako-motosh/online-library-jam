import Order from '../models/order.model.js';

// Can be seen by both admin and borrower UI
export const getAllOrders = async (request, response) => {
  try {
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
      message: `List of orders:`,
      data: orders
    })

  } catch (error) {
    console.error(error);
    response.send(error.message);
  }
};

// Can be seen by both admin and user
export const getOrdersPerQueriedUser = async (request, response) => {
  try {
    const user = await Order.findOne({ userId: request.query.userId }).populate({
      path: 'userId',
      select: 'firstName lastName'
    })
    const fullName = `${user.userId.firstName} ${user.userId.lastName}`;

    const orders = await Order
    .find({ userId: request.query.userId })
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
    message: `List of orders by ${fullName}`,
    data: orders
  })
  } catch (error) {
    console.error(error);
    response.send(error.message);
  };
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
    const orderStatus = await Order.findOne({ _id: id });

    let updatedOrder;

    if (orderStatus.status === 'reserved') {
      updatedOrder = await Order.findOneAndUpdate(
        { _id: id },
        { $set: { 
          status: 'borrowed',
          dateBorrowed: Date.now()
        } },
        { new: true }
        );

      response.status(200).send({
        message: `Order ID no: ${id} has already been picked up by the borrower.`
      });

      } else if (orderStatus.status === 'borrowed') {
      updatedOrder = await Order.findOneAndUpdate(
        { _id: id },
        { $set: { 
          status: 'available',
          dateReturned: Date.now()
        } },
        { new: true }
        );
      response.status(200).send({
        message: `Order ID no: ${id} has been returned by the borrower.`
      });
      } else {
        response.status(404).send({
          message: `Order ID no: ${id} not found.`
        })
      }
    } catch (error) {
    console.error(error);
    response.send(error.message);
  }
};