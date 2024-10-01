# ✨ RESTful APIs for Multi-Vendor E-Commerce Systems

Welcome to the **E-Commerce Backend APIs** project! This is a powerful and flexible backend solution built with modern technologies to support e-commerce functionalities.

## 📚 Table of Contents

| Route Type                                 | Route Description                   |
| ------------------------------------------ | ----------------------------------- |
| [🌟 Features](#features)                   | Explore the features of the API.    |
| [🛠️ Technologies Used](#technologies-used) | Discover the technologies utilized. |
| [📦 Installation](#installation)           | Instructions to set up the project. |
| [📑 API Documentation](#api-documentation) | Detailed API documentation.         |

## 🌟 Features

<a name="features"></a>

- **RESTful API:** Well-structured and intuitive API endpoints designed for seamless integration into various applications. 🚀
- **Secure User Authentication:** Robust JWT-based authentication to ensure user security and session management. 🔐
- **Payment Integration:** Effortless payment processing through Stripe, providing a secure and user-friendly checkout experience. 💳
- **Effortless File Uploads:** Simplify file uploads with Multer, making it easy to manage and store user-generated content. 📂
- **Comprehensive Data Validation:** Maintain data integrity and accuracy using Zod validation, ensuring all inputs meet predefined criteria. ✅
- **Real-time Notifications:** Enhance user experience by sending timely password reset OTPs via Nodemailer, ensuring quick account recovery. 📬
- **Performance Optimization:** Boost application performance with Redis caching, reducing response times and improving load handling. ⚡
- **Efficient Database Management:** Leverage Prisma for smooth and efficient database operations with MongoDB, ensuring data accessibility and reliability. 🗄️

## 🛠️ Technologies Used

<a name="technologies-used"></a>

- **Node.js:** 🌐 JavaScript runtime environment for building scalable server-side applications.
- **Express:** ⚙️ Minimalist web framework for creating robust APIs with ease.
- **TypeScript:** 📝 A superset of JavaScript that adds static typing for enhanced development and code quality.
- **MongoDB:** 📊 NoSQL database for flexible and scalable data storage solutions.
- **Redis:** ⚡ In-memory data structure store, utilized as a fast caching layer to improve performance.
- **Prisma:** 🛠️ Modern ORM that streamlines database interactions and migrations.
- **Zod:** 📋 TypeScript-first schema declaration and validation library for data integrity.
- **JWT:** 🔑 JSON Web Tokens used for secure and stateless user authentication.
- **Stripe:** 💳 Payment processing service for handling online transactions securely.
- **Firebase:** ☁️ Real-time database and cloud storage solutions for user data management.
- **Multer:** 📂 Middleware designed for handling file uploads seamlessly.
- **Nodemailer:** ✉️ Module for sending emails easily, enhancing user communication.

## 📦 Installation

<a name="installation"></a>

To get started with the project, follow these steps:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/moazelgandy2/multi-vendor-ecommerce-api.git
    cd multi-vendor-ecommerce-api
    ```
2.  **Install the Dependencies**
    ```bash
     npm install
     OR
     yarn install
    ```
3.  **Set Up Environment Variables**

    To configure the application, you will need to set the following environment variables in a `.env` file:

    | Variable                       | Description                                      |
    | ------------------------------ | ------------------------------------------------ |
    | `BASE_URL`                     | Base URL of the application                      |
    | `PORT`                         | Port number to run the server                    |
    | `NODE_ENV`                     | Environment mode (e.g., development, production) |
    | `DATABASE_URL`                 | MongoDB connection string                        |
    | `REDIS_URL`                    | Redis connection string                          |
    | `JWT_SECRET`                   | Secret key for JWT signing                       |
    | `STRIPE_SECRET_KEY`            | Stripe secret key for payment processing         |
    | `STRIPE_WEBHOOK_SECRET`        | Stripe webhook secret for event handling         |
    | `EMAIL`                        | Email address for sending notifications          |
    | `PASSWORD`                     | Email password for authentication                |
    | `FIREBASE_API_KEY`             | Firebase API key                                 |
    | `FIREBASE_AUTH_DOMAIN`         | Firebase Auth domain                             |
    | `FIREBASE_PROJECT_ID`          | Firebase project ID                              |
    | `FIREBASE_STORAGE_BUCKET`      | Firebase storage bucket URL                      |
    | `FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID                     |
    | `FIREBASE_APP_ID`              | Firebase app ID                                  |
    | `FIREBASE_MEASUREMENT_ID`      | Firebase measurement ID for analytics            |

    Make sure to replace the placeholder values with your actual configuration before running the application.

4.  **Run the Application**

    ```bash
    npm run dev
    OR
    yarn dev
    ```

    The server will start on the specified port, and you can access the API at `http://localhost:PORT`.

## 📑 API Documentation

<a name="api-documentation"></a>

| Route Type                                         | Route Description                               |
| -------------------------------------------------- | ----------------------------------------------- |
| [🔐 Authentication Routes](#authentication-routes) | View the routes related to user authentication. |
| [🛒 Products Routes](#products-routes)             | Explore the routes for managing products.       |
| [🏷️ Categories Routes](#categories-routes)         | Access routes for category management.          |
| [⭐ Reviews Routes](#reviews-routes)               | View routes for managing product reviews.       |
| [🌠 Wishlist Routes](#wishlist-routes)             | Access routes for user wishlists.               |
| [🛒 Cart Routes](#cart-routes)                     | Explore routes for managing shopping carts.     |
| [🎟️ Coupon Routes](#coupon-routes)                 | View routes for managing coupons.               |
| [🛍️ Order Routes](#order-routes)                   | Access routes for order management.             |
| [💳 Checkout Routes](#checkout-routes)             | Explore routes for the checkout process.        |

## 🔐 Authentication Routes

<a name="authentication-routes"></a>

- **Base route:** `/auth`

### 1. Sign Up

- **Endpoint:** `POST /signup`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "phone": "string",
    "password": "string",
    "address": [
      {
        "street": "string",
        "city": "string",
        "state": "string",
        "zip": "string",
        "isDefault": "boolean"
      }
    ]
  }
  ```
- **Response:**

  ```json
  {
    "success": true,
    "message": "You have successfully signed up.",
    "data": {
      "token": "<jwt_token>"
    }
  }
  ```

- **Errors**:

  - `400 Bad Request`: If the request body is missing required fields or has invalid values.
  - `409 Conflict`: If the email address is already in use.
  - `500 Internal Server Error`: If an error occurs while creating the user.

### 2. Sign In

- **Endpoint:** `POST /signin`
- **Description:** Logs in an existing user.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "token": "string"
  }
  ```
- **Errors:**

  - `400 Bad Request`: If the request body is missing required fields or has invalid values.
  - `401 Unauthorized`: If the email or password is incorrect.
  - `500 Internal Server Error`: If an error occurs while logging in the user.

### 3. Change Password

- **Endpoint**: `POST /password/update`
- **Description**: Changes the user's password.
- **Authorization:** Requires `authMiddleware`
- **Request Body:**
  ```json
  {
    "oldPassword": "string",
    "newPassword": "string"
  }
  ```
- **Response:**
  ```json
  {
    "message": "string"
  }
  ```
- **Errors:**

  - `400 Bad Request`: If the request body is missing required fields or has invalid values.
  - `401 Unauthorized`: If the user is not authenticated or the old password is incorrect.
  - `500 Internal Server Error`: If an error occurs while changing the password.

### 4. Forgot Password

- **Endpoint**: `POST /password/forgot`
- **Description**: Sends a password reset OTP to the user's email.
- **Request Body:**
  ```json
  {
    "email": "string"
  }
  ```
- **Response:**
  ```json
  {
    "message": "string"
  }
  ```
- **Errors:**

  - `400 Bad Request`: If the request body is missing required fields or has invalid values.
  - `404 Not Found`: If the email address is not registered.
  - `500 Internal Server Error`: If an error occurs while sending the OTP.

- **Note:** The OTP will be sent to the user's email address for verification.

### 5. Verify OTP

- **Endpoint**: `POST /otp/verify`
- **Description**: Verifies the OTP sent to the user's email.
- **Request Body:**
  ```json
  {
    "email": "string",
    "otp": "string"
  }
  ```
- **Response:**
  ```json
  {
    "password": "string"
  }
  ```
- **Errors:**

  - `400 Bad Request`: If the request body is missing required fields or has invalid values.
  - `401 Unauthorized`: If the OTP is incorrect or expired.
  - `500 Internal Server Error`: If an error occurs while verifying the OTP.

- **Note:** This generates a new temporary password for the user to log in with.

### 6. Get User Profile

- **Endpoint**: `GET /profile`
- **Description**: Retrieves the user's profile information.
- **Authorization:** Requires `authMiddleware`
- **Response:**

  ```json
  {
    "id": "string",
    "username": "string",
    "email": "string",
    "phone": "string",
    "address": [
      {
        "street": "string",
        "city": "string",
        "state": "string",
        "zip": "string",
        "isDefault": "boolean"
      }
    ]
  }
  ```

- **Errors:**

  - `401 Unauthorized`: If the user is not authenticated.
  - `500 Internal Server Error`: If an error occurs while fetching the user's profile.

### 7. Update User Profile

- **Endpoint**: `PUT /profile`
- **Description**: Updates the user's profile information.
- **Authorization:** Requires `authMiddleware`
- **Request Body:**

  ```json
  {
    "username": "string",
    "email": "string",
    "phone": "string"
  }
  ```

- **Response:**
  ```json
  {
    "message": "string"
  }
  ```
- **Errors:**

  - `400 Bad Request`: If the request body is missing required fields or has invalid values.
  - `401 Unauthorized`: If the user is not authenticated.
  - `500 Internal Server Error`: If an error occurs while updating the user's profile.

## 🛒 Products Routes

<a name="products-routes"></a>

- **Base route:** `/products`

### 1. Get All Products

- **Endpoint:** `GET /`
- **Description:** Retrieves a paginated list of all products along with their associated categories, reviews, and seller information.
- **Query Parameters:**

  - `page` (integer, optional): The page number to retrieve (default is 1).
  - `limit` (integer, optional): The number of products to return per page (default is 10).

- **Response:**
  ```json
  {
    "products": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "price": "number",
        "quantity": "number",
        "images": ["string"],
        "category": {
          "id": "string",
          "name": "string"
        },
        "reviews": [
          {
            "id": "string",
            "rating": "number",
            "comment": "string",
            "user": {
              "id": "string",
              "username": "string"
            }
          }
        ],
        "seller": {
          "id": "string",
          "username": "string",
          "email": "string",
          "phone": "string"
        }
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
  ```
- **Note:** The products are paginated based on the query parameters provided.

### 2. Get a Single Product

- **Endpoint:** `GET /:id`
- **Description:** Retrieves a single product by its ID, including associated category, reviews, and seller information.
- **Path Parameters:**

  - `id` (string): The ID of the product (must be a valid 24-character string).

- **Response:**
  ```json
  {
    "status": "success",
    "message": "Product found",
    "data": {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "category": {
        "name": "string"
      },
      "reviews": [
        {
          "rating": "number",
          "comment": "string",
          "user": {
            "username": "string",
            "email": "string"
          }
        }
      ],
      "seller": {
        "username": "string",
        "email": "string",
        "phone": "string"
      }
    }
  }
  ```
- **Errors:**

  - `400 Bad Request`: If the provided product ID is invalid or missing.
  - `404 Not Found`: If the product with the given ID does not exist.
  - `500 Internal Server Error`: If an error occurs while fetching the product.

### 3. Add a New Product

- **Endpoint:** `POST /`
- **Description:** Creates a new product. This endpoint requires authentication and is restricted to users with the role of "admin" or "seller".
- **Authorization:** Requires `authMiddleware` and `allowedRoles` middleware.
- **Request Body:**
  ```json
  {
    "name": "string",
    "price": "number",
    "image": (required file),
    "categoryId": "string",
    "description": "string",
    "stock": "number"
  }
  ```
- **Response:**

  ```json
  {
    "status": "success",
    "message": "Product created",
    "data": {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "categoryId": "string",
      "sellerId": "string",
      "stock": "number",
      "image": "string"
    }
  }
  ```

- **Errors:**

  - `400 Bad Request`: If the request body is invalid, the category ID is invalid, or the image file is missing.
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user does not have the required role to create a product.
  - `404 Not Found`: If the specified category does not exist.
  - `500 Internal Server Error`: If an error occurs while creating the product.

### 4. Update Product

- **Endpoint:** `PUT /:id`
- **Description:** Updates the details of an existing product. This endpoint requires authentication and is restricted to users with the role of "admin" or "seller".
- **Authorization:** Requires `authMiddleware` and `allowedRoles` middleware.
- **URL Parameters:**

  - `id` (required): The ID of the product to be updated (must be a valid 24-character string).

- **Request Body:**

  ```json
  {
    "name": "string",
    "price": "number",
    "image": (optional file),
    "categoryId": "string",
    "description": "string",
    "stock": "number"
  }
  ```

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Product updated",
    "data": {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "categoryId": "string",
      "sellerId": "string",
      "stock": "number",
      "image": "string"
    }
  }
  ```

- **Errors:**

  - `400 Bad Request`: If the request body is invalid or the category ID is invalid.
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user does not have the required role to update the product.
  - `404 Not Found`: If the specified product does not exist.
  - `500 Internal Server Error`: If an error occurs while updating the product.

### 5. Delete Product

- **Endpoint:** `DELETE /products/:id`
- **Description:** Deletes an existing product. This endpoint requires authentication and is restricted to users with the role of "admin" or "seller".
- **Authorization:** Requires `authMiddleware` and `allowedRoles` middleware.
- **URL Parameters:**
  - `id` (required): The ID of the product to be deleted (must be a valid 24-character string).
- **Response:**

  ```json
  {
    "status": "success",
    "message": "Product deleted",
    "data": {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "categoryId": "string",
      "sellerId": "string",
      "stock": "number",
      "image": "string"
    }
  }
  ```

- **Errors:**
  - `400 Bad Request`: If the product ID is invalid or missing.
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user does not have the required role to delete the product.
  - `404 Not Found`: If the specified product does not exist.
  - `500 Internal Server Error`: If an error occurs while deleting the product.

## 🏷️ Categories Routes 🏷️

<a name="categories-routes"></a>

- **Base route:** `/categories`

### 1. Get All Categories

- **Endpoint:** `GET /`
- **Description:** Retrieve a paginated list of all categories.
- **Query Parameters:**
  - `page` (number, optional): The page number for pagination (defaults to 1).
  - `limit` (number, optional): The number of categories per page (defaults to 5).
- **Response:**

  ```json
  {
    "status": "success",
    "message": "Categories retrieved, page: {page} & limit: {limit}",
    "data": [
      {
        "id": "string",
        "name": "string",
        "description": "string"
      }
    ]
  }
  ```

- **Errors**:
  - `500 Internal Server Error`: If an error occurs while retrieving the categories.

### 2. Get Category with Products

- **Endpoint:** `GET /:id`
- **Description:** Retrieve a specific category along with its associated products.
- **Parameters:**
  - `id` (string): The ID of the category.
- **Response:**

  ```json
  {
    "status": "success",
    "message": "Category with products",
    "data": {
      "id": "string",
      "name": "string",
      "description": "string",
      "products": [
        {
          "name": "string",
          "price": "number",
          "description": "string",
          "seller": {
            "username": "string",
            "email": "string"
          },
          "reviews": [
            {
              "rating": "number",
              "comment": "string"
            }
          ]
        }
      ]
    }
  }
  ```

- **Errors**:
  - `400 Bad Request`: If the category ID is invalid or missing.
  - `404 Not Found`: If the specified category does not exist.
  - `500 Internal Server Error`: If an error occurs while fetching the category.

### 3. Create Category

- **Endpoint:** `POST /`
- **Description:** Create a new product category. Only accessible by admin users.
- **Authorization:** Requires `authMiddleware` and `allowedRoles("admin")`
- **Request Body:**

  ```json
  {
    "name": "string"
  }
  ```

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Category created",
    "data": {
      "id": "string",
      "name": "string"
    }
  }
  ```

- **Errors**:
  - `400 Bad Request`: If the request body is missing required fields or has invalid values.
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user does not have the required role to create a category.
  - `500 Internal Server Error`: If an error occurs while creating the category.

### 4. Update Category

- **Endpoint:** `PUT /:id`
- **Description:** Update an existing category. Only accessible by admin users.
- **Authorization:** Requires `authMiddleware` and `allowedRoles("admin")`
- **Parameters:**

  - `id` (string): The ID of the category to update.

- **Request Body:**

  ```json
  {
    "name": "string"
  }
  ```

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Category updated",
    "data": {
      "id": "string",
      "name": "string"
    }
  }
  ```

- **Errors**:
  - `400 Bad Request`: If the request body is missing required fields or has invalid values.
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user does not have the required role to update the category.
  - `404 Not Found`: If the specified category does not exist.
  - `500 Internal Server Error`: If an error occurs while updating the category.

### 5. Delete Category

- **Endpoint:** `DELETE /:id`
- **Description:** Delete a category. Only accessible by admin users.
- **Authorization:** Requires `authMiddleware` and `allowedRoles("admin")`
- **Parameters:**

  - `id` (string): The ID of the category to delete.

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Category deleted",
    "data": {
      "id": "string",
      "name": "string"
    }
  }
  ```

- **Errors**:
  - `400 Bad Request`: If the category ID is invalid or missing.
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user does not have the required role to delete the category.
  - `404 Not Found`: If the specified category does not exist.
  - `500 Internal Server Error`: If an error occurs while deleting the category.

## ⭐ Reviews Routes ⭐

<a name="reviews-routes"></a>

- **Base route:** `/reviews`

### 1. Get Product Reviews

- **Endpoint:** `GET /reviews/product/:id`
- **Description:** Fetch all reviews for a specific product.
- **Parameters:**
  - `id` (string): The ID of the product.
- **Authorization:** Requires `authMiddleware`
- **Response:**

  ```json
  {
    "status": "success",
    "message": "Reviews fetched successfully",
    "data": [
      {
        "id": "string",
        "rating": "number",
        "comment": "string",
        "user": {
          "id": "string",
          "username": "string",
          "email": "string"
        }
      }
    ]
  }
  ```

- **Errors**:
  - `400 Bad Request`: If the request body is missing required fields or has invalid values.
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user has already reviewed the product.
  - `404 Not Found`: If the specified product does not exist.
  - `500 Internal Server Error`: If an error occurs while adding the review.

### 2. Add Review

- **Endpoint:** `POST /product/:id`
- **Description:** Add a new review for a specific product.
- **Parameters:**
  - `id` (string): The ID of the product.
- **Authorization:** Requires `authMiddleware`
- **Request Body:**

  ```json
  {
    "rating": "number",
    "comment": "string"
  }
  ```

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Review added successfully",
    "data": {
      "id": "string",
      "comment": "string",
      "rating": "number",
      "productId": "string",
      "userId": "string"
    }
  }
  ```

- **Errors**:
  - `400 Bad Request`: If the request body is missing required fields or has invalid values.
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user has already reviewed the product.
  - `404 Not Found`: If the specified product does not exist.
  - `500 Internal Server Error`: If an error occurs while adding the review.

### 3. Update Review

- **Endpoint:** `PUT /reviews/:id`
- **Description:** Update an existing review by its ID.
- **Parameters:**
  - `id` (string): The ID of the review to update.
- **Authorization:** Requires `authMiddleware`
- **Request Body:**

  ```json
  {
    "rating": "number",
    "comment": "string"
  }
  ```

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Review updated successfully.",
    "data": {
      "id": "string",
      "comment": "string",
      "rating": "number",
      "productId": "string",
      "userId": "string"
    }
  }
  ```

- **Errors**:

  - `400 Bad Request`: If the request body is missing required fields or has invalid values.
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user is not the author of the review.
  - `404 Not Found`: If the specified review does not exist.
  - `500 Internal Server Error`: If an error occurs while updating the review.

  ### 4. Delete Review

- **Endpoint:** `DELETE /reviews/:id`
- **Description:** Delete an existing review by its ID.
- **Parameters:**
  - `id` (string): The ID of the review to delete.
- **Authorization:** Requires `authMiddleware`
- **Response:**

  ```json
  {
    "status": "success",
    "message": "Review deleted successfully.",
    "data": {
      "id": "string",
      "comment": "string",
      "rating": "number",
      "productId": "string",
      "userId": "string"
    }
  }
  ```

- **Errors**:
  - `400 Bad Request`: If the review ID is invalid or missing.
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user is not the author of the review.
  - `404 Not Found`: If the specified review does not exist.
  - `500 Internal Server Error`: If an error occurs while deleting the review.

### 5. Get User Reviews

- **Endpoint:** `GET /reviews/user/:id`
- **Description:** Fetch all reviews written by a specific user.
- **Parameters:**
  - `id` (string): The ID of the user whose reviews are to be fetched.
- **Authorization:** Requires `authMiddleware` and `admin` role.
- **Response:**

  ```json
  {
    "status": "success",
    "message": "Reviews fetched successfully",
    "data": [
      {
        "rating": "number",
        "comment": "string",
        "product": {
          "name": "string",
          "price": "number",
          "description": "string",
          "image": "string",
          "stock": "number",
          "sold": "number",
          "category": {
            "name": "string"
          }
        },
        "user": {
          "username": "string",
          "email": "string",
          "phone": "string"
        }
      }
    ]
  }
  ```

- **Errors**:
  - `400 Bad Request`: If the request body is missing required fields or has invalid values.
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user is not an admin.
  - `404 Not Found`: If the specified user does not exist.
  - `500 Internal Server Error`: If an error occurs while fetching the reviews.

## 🌠 Wishlist Routes 🌠

<a name="wishlist-routes"></a>

- **Base route:** `/wishlist`

### 1. Get User Wishlist

- **Endpoint:** `GET /me`
- **Description:** Fetch the wishlist for the authenticated user.
- **Authorization:** Requires `authMiddleware`
- **Response:**

  ```json
  {
    "status": "success",
    "message": "User wish list",
    "data": [
      {
        "product": {
          "name": "string",
          "price": "number",
          "description": "string",
          "image": "string",
          "category": {
            "name": "string"
          },
          "seller": {
            "username": "string",
            "email": "string",
            "phone": "string"
          }
        }
      }
    ]
  }
  ```

- **Errors**:
  - `401 Unauthorized`: If the user is not authenticated.
  - `500 Internal Server Error`: If an error occurs while fetching the wishlist.

### 2. Add Product to Wishlist

- **Endpoint:** `POST /:id`
- **Description:** Adds a product to the authenticated user's wishlist.
- **Authorization:** Requires `authMiddleware`
- **URL Parameters:**

  - `id` (string) - The ID of the product to add to the wishlist.

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Product added to wish list",
    "data": [
      {
        "product": {
          "name": "string",
          "price": "number",
          "description": "string",
          "image": "string",
          "category": {
            "name": "string"
          },
          "seller": {
            "username": "string",
            "email": "string",
            "phone": "string"
          }
        }
      }
    ]
  }
  ```

- **Errors**:

  - `400 Bad Request`: If the product ID is invalid or missing.
  - `401 Unauthorized`: If the user is not authenticated.
  - `500 Internal Server Error`: If an error occurs while adding the product to the wishlist.

### 3. Remove Product from Wishlist

- **Endpoint:** `DELETE /:id`
- **Description:** Removes a product from the authenticated user's wishlist.
- **Authorization:** Requires `authMiddleware`
- **URL Parameters:**

  - `id` (string) - The ID of the product to remove from the wishlist.

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Product removed from wish list",
    "data": [
      {
        "product": {
          "name": "string",
          "price": "number",
          "description": "string",
          "image": "string",
          "category": {
            "name": "string"
          },
          "seller": {
            "username": "string",
            "email": "string",
            "phone": "string"
          }
        }
      }
    ]
  }
  ```

- **Errors**:

  - `400 Bad Request`: If the product ID is invalid or missing.
  - `401 Unauthorized`: If the user is not authenticated.
  - `500 Internal Server Error`: If an error occurs while removing the product from the wishlist.

### 4. Clear User Wishlist

- **Endpoint:** `DELETE /`
- **Description:** Clears all products from the authenticated user's wishlist.
- **Authorization:** Requires `authMiddleware`

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Wish list cleared",
    "data": {
      "count": number
    }
  }
  ```

- **Errors**:
  - `401 Unauthorized`: If the user is not authenticated.
  - `500 Internal Server Error`: If an error occurs while clearing the wishlist.

## 🛒 Cart Routes 🛒

<a name="cart-routes"></a>

- **Base route:** `/cart`

### 1. Get User Cart

- **Endpoint:** `GET /me`
- **Description:** Fetches the authenticated user's cart, including all items in it.
- **Authorization:** Requires `authMiddleware`

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Cart fetched successfully",
    "data": {
      "id": "string",
      "userId": "string",
      "cartItems": [
        {
          "id": "string",
          "productId": "string",
          "quantity": number,
          "product": {
            "id": "string",
            "name": "string",
            "price": number,
            "description": "string",
            "image": "string"
          }
        }
      ]
    }
  }
  ```

- **Errors**:
  - `401 Unauthorized`: If the user is not authenticated.
  - `404 Not Found`: If no cart is found for the user.
  - `500 Internal Server Error`: If an error occurs while fetching the cart.

### 2. Add Product to Cart

- **Endpoint:** `POST /product/:id`
- **Description:** Adds a product to the authenticated user's cart. If the cart does not exist, it creates one. If the product is already in the cart, it returns an error.
- **Authorization:** Requires `authMiddleware`

- **URL Parameters:**

  - `id` (string): The ID of the product to be added to the cart.

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Product added to cart",
    "data": {
      "id": "string",
      "userId": "string",
      "cartItems": [
        {
          "id": "string",
          "productId": "string",
          "quantity": number,
          "product": {
            "id": "string",
            "name": "string",
            "price": number,
            "description": "string",
            "image": "string"
          }
        }
      ]
    }
  }
  ```

- **Errors**:
  - `400 Bad Request`: If the product ID is invalid or missing.
  - `401 Unauthorized`: If the user is not authenticated.
  - `404 Not Found` If the specified product does not exist.
  - `500 Internal Server Error`: If an error occurs while adding the product to the cart.

### 3. Delete Cart

- **Endpoint:** `DELETE /:id`
- **Description:** Deletes a specified cart for the authenticated user. If the user is an admin, they can delete any cart.
- **Authorization:** Requires `authMiddleware`

- **URL Parameters:**

  - `id` (string): The ID of the cart to be deleted.

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Cart cleared successfully",
    "data": {}
  }
  ```

- **Errors**:
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user is not an admin and tries to delete another user's cart.
  - `404 Not Found`: If the specified cart does not exist.
  - `500 Internal Server Error`: If an error occurs while deleting the cart.

### 4. Update User Cart

- **Endpoint:** `PUT /product/:id`
- **Description:** Updates the quantity of a specified product in the user's cart.
- **Authorization:** Requires `authMiddleware`

- **URL Parameters:**

  - `id` (string): The ID of the product to be updated.

- **Request Body:**

  - `quantity` (number): The new quantity of the product in the cart.

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Cart updated successfully",
    "data": {}
  }
  ```

- **Errors**:
  - `401 Unauthorized`: If the user is not authenticated.
  - `404 Not Found`: If the specified product does not exist.
  - `500 Internal Server Error`: If an error occurs while updating the cart.

### 5. Remove Product from Cart

- **Endpoint:** `DELETE /product/:id`
- **Description:** Removes a specified product from the authenticated user's cart. If the cart is empty after removal, the cart is deleted.
- **Authorization:** Requires `authMiddleware`

- **URL Parameters:**

  - `id` (string): The ID of the product to be removed from the cart.

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Product removed from cart successfully",
    "data": {
      "id": "string",
      "userId": "string",
      "cartItems": [
        {
          "id": "string",
          "productId": "string",
          "quantity": number,
          "product": {
            "id": "string",
            "name": "string",
            "price": number,
            "description": "string",
            "image": "string"
          }
        }
      ]
    }
  }
  ```

- **Errors**:
  - `401 Unauthorized`: If the user is not authenticated.
  - `404 Not Found`: If the specified product does not exist.
  - `500 Internal Server Error`: If an error occurs while removing the product from the cart.

## 🎟️ Coupon Routes 🎟️

<a name="coupon-routes"></a>

- **Base route:** `/coupon`

### 1. Create Coupon

- **Endpoint:** `POST /create`
- **Description:** Creates a new coupon that can be used for discounts. Only admins are authorized to create coupons.
- **Authorization:** Requires `authMiddleware`

- **Request Body:**

  ```json
  {
    "code": "string",
    "discount": number,
    "expiryInDays": number
  }
  ```

- **Response:**

  ```json
  {
  "status": "success",
  "message": "Coupon created",
  "data": {
    "code": "string",
    "discount": number,
    "expiryInDays": number
  }
  }
  ```

- **Errors**:
  - `400 Bad Request`: If the request body is missing required fields or has invalid values.
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user is not an admin.
  - `500 Internal Server Error`: If an error occurs while creating the coupon.

### 2. Delete Coupon

- **Endpoint:** `DELETE /:code`
- **Description:** Deletes a specified coupon from the system. Only admins are authorized to delete coupons.
- **Authorization:** Requires `authMiddleware`

- **URL Parameters:**

  - `code` (string): The code of the coupon to be deleted.

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Coupon deleted",
    "data": {
      "code": "string"
    }
  }
  ```

- **Errors**:
  - `400 Bad Request`: If the coupon code is invalid or missing.
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user is not an admin.
  - `500 Internal Server Error`: If an error occurs while deleting the coupon.

### 3. Apply Coupon

- **Endpoint:** `POST /apply`
- **Description:** Applies a coupon to the authenticated user's cart. If the coupon is valid, it updates the cart total and applies the discount.
- **Authorization:** Requires `authMiddleware`

- **Request Body:**

  ```json
  {
    "code": "string"
  }
  ```

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Coupon applied",
    "data": {
      "discount": number
    }
  }
  ```

- **Errors**:
  - `400 Bad Request`: If the request body is missing required fields or has invalid values.
  - `401 Unauthorized`: If the user is not authenticated.
  - `500 Internal Server Error`: If an error occurs while applying the coupon.

## 🛍️ Order Routes 🛍️

<a name="order-routes"></a>

- **Base route:** `/order`

### 1. Create Order

- **Endpoint:** `POST /create`
- **Description:** Creates a new order for the authenticated user based on their current cart.
- **Authorization:** Requires `authMiddleware`

- **Query Parameters:**

  - `payment` (string): The payment type (either "COD" or "CARD").

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Order created",
    "data": {
      "order": {
        "id": "string",
        "total": number,
        "status": "PENDING",
        "paymentType": "COD" | "CARD",
        "delivery": "PENDING",
        "userId": "string",
        "orderItems": [
          {
            "id": "string",
            "productId": "string",
            "quantity": number,
            "createdAt": "string",
            "updatedAt": "string"
          }
        ],
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
  }
  ```

- **Errors**:
  - `401 Unauthorized`: If the user is not authenticated.
  - `404 Not Found`: If the user has no carts.
  - `500 Internal Server Error`: If an error occurs while creating the order.

### 2. Filter Orders

- **Endpoint:** `GET /me`
- **Description:** Retrieves and filters orders for the authenticated user based on specified query parameters.
- **Authorization:** Requires `authMiddleware`

- **Query Parameters:**

  - `status` (string, optional): Filter orders by status (e.g., "PENDING", "ACCEPTED", "REJECTED", "DELIVERED").
  - `delivery` (string, optional): Filter orders by delivery status (e.g., "PENDING", "ACCEPTED", "REJECTED", "DELIVERED").
  - `paymentType` (string, optional): Filter orders by payment type (e.g., "COD", "CARD").

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Orders found",
    "data": {
      "orders": [
        {
          "id": "string",
          "total": number,
          "status": "PENDING" | "ACCEPTED" | "REJECTED" | "DELIVERED",
          "paymentType": "COD" | "CARD",
          "delivery": "PENDING" | "ACCEPTED" | "REJECTED" | "DELIVERED",
          "userId": "string",
          "orderItems": [
            {
              "id": "string",
              "productId": "string",
              "quantity": number,
              "createdAt": "string",
              "updatedAt": "string"
            }
          ],
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
  }
  ```

- **Errors**:
  - `401 Unauthorized`: If the user is not authenticated.
  - `404 Not Found`: If no orders are found for the user.
  - `500 Internal Server Error`: If an error occurs while fetching the orders.

### 3. Cancel Order

- **Endpoint:** `GET /me/cancel/:id`
- **Description:** Cancels a specific order for the authenticated user by its ID.
- **Authorization:** Requires `authMiddleware`

- **Path Parameters:**

  - `id` (string, required): The unique identifier of the order to be cancelled.

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Order cancelled",
    "data": {
      "orderData": {
        "id": "string",
        "total": number,
        "status": "PENDING" | "ACCEPTED" | "REJECTED" | "DELIVERED",
        "paymentType": "COD" | "CARD",
        "delivery": "PENDING" | "ACCEPTED" | "REJECTED" | "DELIVERED",
        "userId": "string",
        "orderItems": [
          {
            "id": "string",
            "productId": "string",
            "quantity": number,
            "createdAt": "string",
            "updatedAt": "string"
          }
        ],
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
  }
  ```

- **Errors**:
  - `401 Unauthorized`: If the user is not authenticated.
  - `404 Not Found`: If the specified order does not exist.
  - `500 Internal Server Error`: If an error occurs while cancelling the order.

### 4. Delete Order

- **Endpoint:** `DELETE /:id`
- **Description:** Deletes a specific order by its ID. Accessible only to users with the roles of "admin" or "seller."
- **Authorization:** Requires `authMiddleware` and must have either the "admin" or "seller" role.

- **Path Parameters:**

  - `id` (string, required): The unique identifier of the order to be deleted.

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Order deleted",
    "data": {
      "orderData": {
        "id": "string",
        "total": number,
        "status": "PENDING" | "ACCEPTED" | "REJECTED" | "DELIVERED",
        "paymentType": "COD" | "CARD",
        "delivery": "PENDING" | "ACCEPTED" | "REJECTED" | "DELIVERED",
        "userId": "string",
        "orderItems": [
          {
            "id": "string",
            "productId": "string",
            "quantity": number,
            "createdAt": "string",
            "updatedAt": "string"
          }
        ],
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
  }
  ```

- **Errors**:
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user does not have the required role to delete the order (admin or seller).
  - `404 Not Found`: If the specified order does not exist.
  - `500 Internal Server Error`: If an error occurs while deleting the order.

### 5. Update Delivery Status

- **Endpoint:** `PUT /delivery/:id`
- **Description:** Updates the delivery status of a specific order by its ID. Accessible only to users with the roles of "admin" or "seller."
- **Authorization:** Requires `authMiddleware` and must have either the "admin" or "seller" role.

- **Path Parameters:**

  - `id` (string, required): The unique identifier of the order for which the delivery status is being updated.

- **Request Body:**

  ```json
  {
    "status": "PENDING" | "ACCEPTED" | "REJECTED" | "DELIVERED"
  }
  ```

- **Response:**

  ```json
  {
    "status": "success",
    "message": "Order updated",
    "data": {
      "orderData": {
        "id": "string",
        "total": number,
        "status": "PENDING" | "ACCEPTED" | "REJECTED" | "DELIVERED",
        "paymentType": "COD" | "CARD",
        "delivery": "PENDING" | "ACCEPTED" | "REJECTED" | "DELIVERED",
        "userId": "string",
        "orderItems": [
          {
            "id": "string",
            "productId": "string",
            "quantity": number,
            "createdAt": "string",
            "updatedAt": "string"
          }
        ],
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
  }
  ```

- **Errors**:
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user does not have the required role to update the order.
  - `404 Not Found`: If the specified order does not exist.
  - `500 Internal Server Error`: If an error occurs while updating the order.

## 💳 Checkout Routes 💳

<a name="checkout-routes"></a>

- **Base route:** `/checkout`

### 1. Create Checkout Session

- **Endpoint:** `POST /:id`
- **Description:** Creates a checkout session for the authenticated user's pending order with a payment type of "CARD".
- **Authorization:** Requires `authMiddleware`

- **Path Parameters:**

  - `id` (string, required): The unique identifier of the order for which the checkout session is created.

- **Response:**

  ```json
  {
    "success": true,
    "message": "Checkout created",
    "data": {
      "session": {
        "id": "<stripe_checkout_session_id>",
        "object": "checkout.session",
        "amount_subtotal": <amount_subtotal>,         "amount_total": <amount_total>,
        "currency": "<currency>",
        "billing_address_collection": "required",
        "cancel_url": "<cancel_url>",         "customer_email": "<customer_email>",
        "expires_at": <expiration_timestamp>,
        "metadata": {
          "orderId": "<order_id>"
        },
        "mode": "payment",
        "payment_status": "<payment_status>",
        "success_url": "<success_url>",
        "url": "<checkout_url>"
      }
    }
  }
  ```

- **Errors**:
  - `401 Unauthorized`: If the user is not authenticated.
  - `404 Not Found`: If the specified order does not exist.
  - `500 Internal Server Error`: If an error occurs while creating the checkout session.

### 2. Webhook for Stripe Events

- **Endpoint:** `POST (root) /webhook`
- **Description:** Receives and processes Stripe events for successful payments and updates the order status accordingly.

- **Event Types Handled:**

  - **`checkout.session.completed`:**

    - **Action:** Updates the order status to "PAID" in the database.
    - **Outcome:** The order is marked as successfully paid, and the user may receive confirmation and any relevant notifications.

  - **`payment_intent.payment_failed`:**
    - **Action:** Updates the order status to "FAILED" in the database.
    - **Outcome:** The order is marked as failed, and the user may receive a notification regarding the payment failure.

- **Request Headers:**

  - `Stripe-Signature` (string, required): The signature of the webhook event, used to verify its authenticity.

- **Response:**
  ```json
  {
    "received": true
  }
  ```

### 3. Cash on Delivery Payment

- **Endpoint:** `PUT /cash`
- **Description:** Processes payment for an order marked as cash on delivery (COD). This endpoint can only be accessed by users with the roles "admin" or "seller".

- **Authorization:** Requires `authMiddleware` and role check with `allowedRoles("admin", "seller")`.

- **Request Parameters:**

  - **Path Parameters:**
    - `id` (string, required): The unique identifier of the order being paid.

- **Response:**
  ```json
  {
    "success": true,
    "message": "Order paid",
    "data": {
      "orderData": {
        "id": "<order_id>",
        "status": "PAID",
        "paymentType": "COD"
      }
    }
  }
  ```
- **Errors:**
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user does not have the required role to update the order.
  - `404 Not Found`: If the specified order does not exist.
  - `500 Internal Server Error`: If an error occurs while updating the order.
