# API Testing Guide

This guide helps you test the backend APIs using curl commands or Postman.

## Base URL
```
http://localhost:5000/api
```

## Authentication

After signing in via OTP, you'll receive a JWT token. Include it in requests:
```bash
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Endpoints

### Auth Endpoints

#### 1. Send OTP (Sign In / Register)
```bash
curl -X POST http://localhost:5000/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Response:**
```json
{"message":"Verification code sent successfully"}
```

#### 2. Verify OTP (Get Tokens)
```bash
curl -X POST http://localhost:5000/api/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456"}'
```

**Response:**
```json
{
  "message": "Signed in successfully",
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "user_id",
    "email": "test@example.com",
    "role": "customer"
  }
}
```

#### 3. Get Current User (Requires Auth)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 4. Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout
```

---

### Product Endpoints

#### Get All Products
```bash
curl http://localhost:5000/api/products
```

#### Get Products with Filters
```bash
curl "http://localhost:5000/api/products?category=oils&sort=price-asc&limit=10"
```

**Query Parameters:**
- `category`: oils, dryfruits, palm-products, honey, millets, all
- `search`: Product name search
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `sort`: featured, price-asc, price-desc, name, newest, best-selling
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)

#### Get Single Product
```bash
curl http://localhost:5000/api/products/groundnut-oil
```

---

### Order Endpoints

#### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "customer_name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "address": "123 Main St, Chennai",
    "items": [
      {
        "id": "groundnut-oil",
        "name": "Groundnut Oil",
        "size": "1 Litre",
        "price": 299,
        "qty": 2,
        "image": "url_to_image"
      }
    ],
    "subtotal": 598,
    "gst": 107.64,
    "shipping": 50,
    "discount": 0,
    "total": 755.64,
    "payment_method": "Cash on Delivery"
  }'
```

#### Get User's Orders
```bash
curl -X GET http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Get All Orders (Admin Only)
```bash
curl -X GET http://localhost:5000/api/orders \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

#### Update Order Status (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -d '{"status":"shipped"}'
```

**Valid Statuses:** confirmed, packed, shipped, out_for_delivery, delivered

#### Get Order Tracking
```bash
curl http://localhost:5000/api/orders/ORDER_ID/tracking
```

#### Download Invoice PDF
```bash
curl http://localhost:5000/api/orders/ORDER_ID/invoice \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -o invoice.pdf
```

---

### Review Endpoints

#### Get Product Reviews
```bash
curl http://localhost:5000/api/reviews/groundnut-oil
```

#### Submit/Update Review (Requires Auth)
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "product_id": "groundnut-oil",
    "rating": 5,
    "comment": "Excellent quality oil!"
  }'
```

---

### Cart Endpoints

#### Add to Cart (Requires Auth)
```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "product_id": "groundnut-oil",
    "size": "1 Litre",
    "quantity": 2
  }'
```

#### Get Cart (Requires Auth)
```bash
curl http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Remove from Cart (Requires Auth)
```bash
curl -X DELETE http://localhost:5000/api/cart/ITEM_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### Wishlist Endpoints

#### Add to Wishlist (Requires Auth)
```bash
curl -X POST http://localhost:5000/api/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"product_id":"groundnut-oil"}'
```

#### Get Wishlist (Requires Auth)
```bash
curl http://localhost:5000/api/wishlist \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Remove from Wishlist (Requires Auth)
```bash
curl -X DELETE http://localhost:5000/api/wishlist/ITEM_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Testing Flow Example

### 1. Send OTP
```bash
curl -X POST http://localhost:5000/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 2. Verify OTP (use code from email logs)
```bash
curl -X POST http://localhost:5000/api/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456"}'
# Save the accessToken from response
```

### 3. Get Current User
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Get Products
```bash
curl http://localhost:5000/api/products
```

### 5. Create Order
```bash
# See example above
```

### 6. Get Your Orders
```bash
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### 401 Unauthorized
- Token is missing or invalid
- Token may have expired (15 min expiry)
- Use the refresh token to get a new access token

### 403 Forbidden
- You don't have permission (e.g., admin-only endpoint)
- Check your user role

### 404 Not Found
- The resource doesn't exist
- Check the ID or path

### 500 Internal Server Error
- Backend error; check server console logs
- Usually missing required fields in request body

## Postman Setup

1. Create a new Postman collection
2. Add a variable `baseURL`: `http://localhost:5000/api`
3. Add a variable `token`: Leave blank initially
4. After OTP verify, copy the accessToken and paste into the `token` variable
5. In request headers, add: `Authorization: Bearer {{token}}`

This allows you to test authenticated endpoints easily.
