const orderIndex = ({ orders }) => {
  return (
    <div>
      <h1>My Orders</h1>
      <ul>
        {orders.map((order) => {
          return (
            <li key={order.id}>
              {order.ticket.title}-{order.status}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

orderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default orderIndex;
