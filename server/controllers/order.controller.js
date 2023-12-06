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
      message: `Order History`,
      data: orders
    })

  } catch (error) {
    console.error(error);
    response.send(error.message);
  }
};

export const getReservedBooks = async (request, response) => {
  try {
    const orders = await Order
      .find({ status: 'reserved'})
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
      message: `Reserved Books Tracker`,
      data: orders
    });
  } catch (error) {
    console.error(error);
    response.send(error.message);
  }
}

export const getBorrowedBooks = async (request, response) => {
  try {
    const orders = await Order
      .find({ status: 'borrowed'})
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
      message: `Reserved Books Tracker`,
      data: orders
    });
  } catch (error) {
    console.error(error);
    response.send(error.message);
  }
}

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
  try {
    // This query the status of an order (book), advise team that this only queries one book. What if multiple copies of the same book?
    const bookStatus = await Order.findOne({ bookId: request.body.bookId }, 'status');
    // This query checks how many on-going orders a specific user has made
    const orderLimit = await Order.countDocuments({
      userId: request.body.userId,
      status: {$in: ['reserved', 'borrowed', 'overdue']}
    });
    console.log(orderLimit);

    if (orderLimit > 5) {
      return response.status(400).send({
        message: `Maximum of 5 orders have been reached. Ensure some of the books have been returned to create another order.`
      });
    } else {
      // bookSchema does not include 'status', hence the 'booksStatus === null' if the ordered book has not been ordered for the first time. 'bookStatus.status === 'available'' implies that the book has been borrowed before. This will help if we want to implement order history by user.
      if (bookStatus === null || bookStatus.status === 'available') {
        const dateReserved = new Date(Date.now());
        const reserveDueDate = new Date(Date.now() + 60 * 1000); // 1 * 24 * 60 * 60 * 1000 (1 day, but for simulation purposes: 1 minute)
        const returnDueDate = new Date(Date.now() + 2 * 60 * 1000); // 7 * 24 * 60 * 60 * 1000 (7 days, but for simulation purposes: 2 minutes)

        let order = new Order({
          userId: request.body.userId,
          bookId: request.body.bookId,
          dateReserved,
          reserveDueDate,
          returnDueDate
        })
  
        await order.save();
  
        const reserveExpiry = reserveDueDate - Date.now();
        setTimeout(async () => {
          const updatedOrder = await Order.findById(order._id);
          if (updatedOrder.status === 'reserved') {
            updatedOrder.status = 'available';
            await updatedOrder.save();
            console.log(`Reservation time for this book has now passed. Create another order to borrow this book.`);
          }
        }, reserveExpiry);
  
        const returnExpiry = returnDueDate - Date.now();
        setTimeout(async () => {
          const updatedOrder = await Order.findById(order._id);
          if (updatedOrder.status !== 'available') {
            updatedOrder.status = 'overdue';
            await updatedOrder.save();
            console.log(`Return due date for this order has now passed. Please return this book immediately.`)
          }
        }, returnExpiry);
    
        response.status(200).send({
          message: `Order created! Be sure to pick up the book within 1 day.`,
          data: order
        })
      } else if ((bookStatus.status === 'reserved' || bookStatus.status === 'borrowed' || bookStatus.status === 'overdue')) {
        response.status(400).send({
          message: `Book has already been reserved or borrowed. Try again later.`
        })
      } else {
        response.status(200).send({
          message: 'No order was created.'
        })
      };
    };
  } catch (error) {
    console.error(error);
    response.send(error.message);
  };
};

export const updateOrder = async (request, response) => {
  try {
    const { id } = request.params;
    const { proceed } = request.query;
    const orderStatus = await Order.findOne({ _id: id });

    let updatedOrder;

    if (proceed === 'true' && orderStatus.status === 'reserved') {
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

    } else if (proceed === 'false' && orderStatus.status === 'reserved') {
      updatedOrder = await Order.findOneAndUpdate(
        { _id: id },
        { $set: { 
          status: 'available',
          dateBorrowed: Date.now()
        } },
        { new: true }
        );

      response.status(200).send({
        message: `Order ID no: ${id} has been cancelled by the borrower.`
      });
    } else if (proceed === 'true' && orderStatus.status === 'borrowed' || proceed === 'true' && orderStatus.status === 'overdue') {
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
        message: `Order ID no: ${id} has either been completed or cancelled.`
      });
    }
  } catch (error) {
    console.error(error);
    response.send(error.message);
  };
};