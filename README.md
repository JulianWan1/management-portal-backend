# **Management Portal Backend**

The Management Portal serves as an application that allows its admins to create posts that are viewable to both its normal & premium users

Normal users will only get to see normal content unless if they pay to be a premium user, they will have access to both normal & premium posts

This is the backend (of which the admin is responsible of) that handles the CRUD of the app for the following fields:

- Posts

- Categories

- Admins

- Users

- Payments

## **Code Structure**

---

```
├── README.md
├── database
│   └── prisma
│       ├── migrations
│       │   ├── 20230530022551_init
│       │   │   └── migration.sql
│       │   └── migration_lock.toml
│       └── schema.prisma
├── docker-compose.yaml
├── package.json
├── src
│   ├── auth
│   │   ├── auth-methods.ts
│   │   ├── strategies
│   │   │   ├── jwt-access.strategy.ts
│   │   │   └── local.strategy.ts
│   │   └── utils
│   │       └── bcrypt.ts
│   ├── index.ts
│   ├── interfaces
│   │   └── users-interfaces.ts
│   └── routes
│       ├── admin-routes.ts
│       ├── login-routes.ts
│       ├── user-routes.ts
│       └── vendor-routes.ts
└── yarn.lock

```

## **PostgreSQL Access Credentials**

---

To connect to the PostgreSQL database, you will need the following credentials:

- Host: `host.docker.internal`
- Port: `5007`
- Database name: `management-portal-pg-db`
- Username: `julian`
- Password: `password`

You can use these credentials to connect to the database by setting it in the `DATABASE_URL` in your created `.env` file as follows:

```

DATABASE_URL="postgresql://<Username>:<Password>@<Host>:<Port>/<Database name>?schema=public"

```

Of course, this is after running the `docker-compose.yaml` file since our host is using `host.docker.internal`

## **APIs**
---

The APIs which uses `http://localhost:3001/v1` as its base URL, has 4 routes to adhere to

- admin (deals with admin related APIs & are protected by JWT admin middleware)

- user (deals with user related APIs & are protected by JWT user middleware)

- login (deals with user & admin logins separately)

- vendor (deals with BillPlz & other potential 3rd party APIs)


Here are some screenshots of how the backend is tested:

![Screenshot 1](/screenshots/api-list.png)

There are altogether 18 APIs running in this backend


![Screenshot 2](/screenshots/api-test.png)

As an example, these are the results from `http://localhost:3001/v1/users/posts` route where a normal user can only retrieve normal posts

## **Route Directory Link List**
---
**1. For Admin:**
- GET `/admins/posts`: List all posts (all viewable by admin)
- POST `/admins/posts` : Create a Post
- POST `/admins/categories`: Create a Category
- POST `/admins/users`: Create a User
- POST `/admins/`: Create an Admin
- PATCH `/admins/users/:userId`: Update a user based on their id
- PATCH `/admins/:adminId`: Update an admin based on their id
- PATCH `/admins/posts/:postId`: Update a Post based on its id
- PATCH `/admins/categories/:categoryId`: Update a category based on its id
- DELETE `/admins/users/:userId`: Delete a user based on their id
- DELETE `/admins/:adminId`: Delete an admin based on their id
- DELETE `/admins/posts/:postId`: Delete a post based on its id
- DELETE `/admins/categories/:categoryId`: Delete a category based on its id

**2. For User:**
- GET `/users/posts`: List all posts (all viewable by Premium users but normal posts viewable by normal users)
- POST `/users/bill`: Creates a bill to be sent to BillPlz collection after a user intends to upgrade to premium

**3. For Login:**
- POST `/login/user`: For user to login
- POST `/login/admin`: For admin to login

**4. For Vendor:**
- POST `/vendors/membership/:userId`: 

Callback URL BillPlz calls after payment is done by user 

Updates user's membership to Premium & creates a payment record in the Payment table 

