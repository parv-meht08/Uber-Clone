# User Registration Endpoint Documentation

## Endpoint: `/users/register`

### Method: POST

### Description:
This endpoint is used to register a new user in the system. It requires the user's first name, last name, email, and password. The password will be hashed before storing it in the database.

### Request Body:
The request body should be in JSON format and must include the following fields:

- `fullname.firstname`: (string) The first name of the user. It must be at least 3 characters long.
- `fullname.lastname`: (string) The last name of the user. It is optional but should be at least 3 characters long if provided.
- `email`: (string) The email address of the user. It must be a valid email format and at least 5 characters long.
- `password`: (string) The password for the user account. It must be at least 6 characters long.

### Response:
- **Success (201 Created):**
  - Returns a JSON object containing the authentication token and user details.
  - Example:
    ```json
    {
      "token": "your-auth-token",
      "user": {
        "fullname": {
          "firstname": "John",
          "lastname": "Doe"
        },
        "email": "john.doe@example.com"
      }
    }
    ```

- **Error (400 Bad Request):**
  - Returns a JSON object with an array of error messages if validation fails.
  - Example:
    ```json
    {
      "errors": [
        {
          "msg": "Please enter a valid email address",
          "param": "email",
          "location": "body"
        }
      ]
    }
    ```

### Validation:
- The `email` field must be a valid email address.
- The `fullname.firstname` field must be at least 3 characters long.
- The `password` field must be at least 6 characters long.

### Example Request:
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}

```

##  User Login Endpoint

### URL

`POST /users/login`

### Description

This endpoint allows users to log into the application by providing their email and password. Upon successful authentication, a JSON Web Token (JWT) is returned, which can be used for subsequent requests that require authentication.

### Request

- **Method**: POST
- **URL Params**: None
- **Data Params**: The request body must be in JSON format and include the following fields:
  - `email` (string): The user's email address. Must be a valid email format.
  - `password` (string): The user's password. Must not be empty.

### Headers

- `Content-Type: application/json`

### Success Response

- **Code**: 200 OK
- **Content**: 
  ```json
  {
    "token": "your_jwt_token",
    "user": {
      "id": "user_id",
      "fullname": "User Full Name",
      "email": "user@example.com"
    }
  }


## User Profile Endpoint

### URL
`GET /users/profile`

### Description
This endpoint retrieves the profile information of the currently authenticated user. It requires a valid authentication token to be included in either the cookies or the Authorization header.

### Headers
- `Authorization: Bearer <token>` (optional if token is in cookies)

### Success Response
- **Code**: 200 OK
- **Content**: 
  ```json
  {
    "user": {
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "id": "user_id"
    }
  }
  ```

### Error Response
- **Code**: 401 Unauthorized
- **Content**:
  ```json
  {
    "message": "Unauthorized access!"
  }
  ```

## User Logout Endpoint

### URL
`GET /users/logout`

### Description
This endpoint logs out the currently authenticated user by invalidating their token. The token is added to a blacklist and the cookie is cleared. Any subsequent requests with the same token will be rejected.

### Headers
- `Authorization: Bearer <token>` (optional if token is in cookies)

### Success Response
- **Code**: 200 OK
- **Content**:
  ```json
  {
    "message": "User logged out"
  }
  ```

### Error Response
- **Code**: 401 Unauthorized
- **Content**:
  ```json
  {
    "message": "Unauthorized access!"
  }
  ```

### Notes
- The token used for authentication will be blacklisted and cannot be used for future requests
- If the token was stored in cookies, it will be cleared
- After logout, the user will need to log in again to obtain a new token

# Caption Registration Endpoint

## Endpoint: `/caption/register`

### Method: POST

### Description:
This endpoint registers a new caption (driver) in the system. It creates a new caption account with personal information and vehicle details. The password is hashed before storing in the database, and a JWT token is returned upon successful registration.

### Request Body:
The request body should be in JSON format and must include the following fields:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "vehicle": {
    "color": "Black",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Required Fields:
- `fullname.firstname`: (string) Driver's first name. Must be at least 3 characters long.
- `fullname.lastname`: (string) Driver's last name. Optional but must be at least 3 characters if provided.
- `email`: (string) Driver's email address. Must be unique and in valid email format.
- `password`: (string) Account password. Must be at least 6 characters long.
- `vehicle.color`: (string) Vehicle color. Must be at least 3 characters long.
- `vehicle.plate`: (string) Vehicle plate number. Must be at least 3 characters long.
- `vehicle.capacity`: (number) Vehicle passenger capacity. Must be at least 1.
- `vehicle.vehicleType`: (string) Type of vehicle. Must be one of: "car", "motorcycle", "auto".

### Response:
- **Success (201 Created):**
  ```json
  {
    "caption": {
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "vehicle": {
        "color": "Black",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      },
      "status": "inactive",
      "_id": "caption_id"
    },
    "token": "your-auth-token"
  }
  ```

- **Error (400 Bad Request):**
  ```json
  {
    "errors": [
      {
        "msg": "Please enter a valid email address",
        "param": "email",
        "location": "body"
      }
    ]
  }
  ```

### Validation Rules:
- Email must be unique and in valid format
- First name must be at least 3 characters long
- Password must be at least 6 characters long
- Vehicle color must be at least 3 characters long
- Vehicle plate must be at least 3 characters long
- Vehicle capacity must be at least 1
- Vehicle type must be either "car", "motorcycle", or "auto"

### Notes:
- The password is hashed using bcrypt before storage
- A JWT token is generated and returned upon successful registration
- The caption's initial status is set to "inactive"

# Caption Profile Endpoint

## Endpoint: `/caption/profile`

### Method: GET

### Description:
This endpoint retrieves the profile information of the currently authenticated caption (driver). It requires a valid authentication token to be included in either the cookies or the Authorization header.

### Authentication:
- Requires a valid JWT token in either:
  - Cookie: `token`
  - Header: `Authorization: Bearer <token>`

### Success Response:
- **Code**: 200 OK
- **Content**: 
  ```json
  {
    "caption": {
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "vehicle": {
        "color": "Black",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      },
      "status": "inactive",
      "_id": "caption_id"
    }
  }
  ```

### Error Responses:
- **Unauthorized (401)**:
  ```json
  {
    "message": "Unauthorized access!"
  }
  ```
- **Not Found (404)**:
  ```json
  {
    "errors": "Caption not found"
  }
  ```

# Caption Logout Endpoint

## Endpoint: `/caption/logout`

### Method: GET

### Description:
This endpoint logs out the currently authenticated caption by invalidating their token. The token is added to a blacklist to prevent further use, and the authentication cookie is cleared.

### Authentication:
- Requires a valid JWT token in either:
  - Cookie: `token`
  - Header: `Authorization: Bearer <token>`

### Success Response:
- **Code**: 200 OK
- **Content**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

### Error Response:
- **Code**: 401 Unauthorized
- **Content**:
  ```json
  {
    "message": "Unauthorized access!"
  }
  ```

### Notes:
- The token used for authentication will be blacklisted
- If the token was stored in cookies, it will be cleared
- After logout, the caption will need to log in again to obtain a new token

