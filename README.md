# StubHubClone

A mock of the stubhub website. Microservice based architecture with event streaming using NATS.Built with Typescript, Express, MongoDB, Docker, Kubernetes, and NextJS

## Purpose

Create and buy tickets that are posted on the application, and filter based on those that are available

## Routes

### Users

```
POST /api/users/signup
POST /api/users/signin
POST /api/users/signout
GET /api/users/currentuser
```

### Tickets

```
GET /api/tickets (retrieve all tickets)
POST /api/tickets (create ticket)
GET /api/tickets/:id
PUT /api/tickets/:id
```

### Orders

```
DELETE /api/orders/:orderId
GET /api/orders (get all orders made by the user)
POST /api/orders (create an order)
GET /api/tickets/:id (retrieve an order based on orderId)
```

### Payment

```
GET /api/payments
```

## Requirements

NodeJS, Skaffold

## Installation

In terminal

```
git clone https://github.com/deveshp530/stubhubClone.git

cd stubhubClone

skaffold dev
```

Navigate to tickets.dev and type in 'thisisunsafe' in the window to access application. This will not expose any data since the website is on your local machine
