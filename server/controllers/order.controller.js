import Order from '../models/order.model.js';
// import Book from '../models/book.model.js';
// import User from '../models/book.model.js';

export const getOrders = async (request, response) => {
  try {
    // const orders = (await) Insert code that extracts the order from the database based on user token. Populate with book title, author, image, nameOfBorrower, universityIDOfBorrower, reservationCountdown, returnCountdown

    const orders = await Order.find();

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
  try {
    let order = new Order({
      bookRefID: request.body.bookRefID,
      universityID: request.body.universityID
    })
  
    await order.save();

    response.status(200).send({
      
      message: `Order created! Be sure to pick the book within 1 day`,

    })

  } catch (error) {
    console.error(error);
    response.send(error.message);
  }
}

export const updateOrder = async (request, response) => {
  try {
    const { id } = request.params;

    const order = await Order.updateOne({ _id: id }, { status: 'borrowed' });

    if (!order) {
      response.status(404).send({
        message: `Order ID no: ${id} not found.`
      })
    } else {
      response.status(204).send({
        message: `Order ID no: ${id} has been updated.`
      })
    }
  } catch (error) {
    console.error(error);
    response.send(error.message);
  }
}