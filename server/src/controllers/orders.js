// const { Order, Book, Client } = require('../models');
// const {
//   AMQP_QUEUE_REQUEST_STOCK,
// } = require('./../config/configs');
// const { orderState, messageType } = require('../enums');
// const { emailServer } = require('../services/email');
// const { amqpAPI } = require('../services/amqp');


// const create = async (quantity, bookId, clientId) => {
//   const book = await Book.findByPk(bookId);
//   if (!book) {
//     throw new Error('Book not found');
//   }
//   const client = await Client.findByPk(clientId);
//   if (!client) {
//     throw new Error('Client not found');
//   }
//   const orderData = { quantity, bookId, clientId };
//   let order = null;
//   if (book.stock < quantity) {
//     // Make a request to warehouse
//     amqpAPI.publishMessage(AMQP_QUEUE_REQUEST_STOCK,
//       amqpAPI.createMessage(
//         messageType.requestStock,
//         {
//           title: book.title,
//           quantity: quantity + 10,
//         },
//       ));

//     // Make an order
//     order = await Order.create({
//       ...orderData,
//       state: orderState.waiting,
//     });
//   } else {
//     const nextDay = new Date();
//     nextDay.setDate(new Date().getDate() + 1);

//     order = await Order.create({
//       ...orderData,
//       state: orderState.delivered,
//       stateDate: nextDay,
//     });

//     await book.update({
//       stock: book.stock - quantity,
//     });
//   }

//   emailServer.pushEmail(
//     null,
//     client.email,
//     `Order #${order.uuid} confirmed`,
//     'order',
//     {
//       book,
//       client,
//       order,
//       orderState: orderState.toString(order.state, order.stateDate),
//     },
//   );

//   return { ...order.dataValues, Book: book, Client: client };
// };

// const list = async () => Order.findAll({
//   include: [
//     { model: Book },
//     { model: Client },
//   ],
// });

// const retrieve = async orderId => Order.findByPk(orderId, {
//   include: [
//     { model: Book },
//     { model: Client },
//   ],
// });

// const update = async (orderId, state, stateDate) => {
//   const order = await Order.findByPk(orderId, {
//     include: [
//       { model: Book },
//       { model: Client },
//     ],
//   });

//   if (!order) {
//     throw new Error('Order not found');
//   }

//   return order.update({
//     state: state || order.state,
//     stateDate: stateDate || order.stateDate,
//   });
// };

// module.exports = {
//   create,
//   list,
//   retrieve,
//   update,
// };
