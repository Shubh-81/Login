## Authentication API

### Register User

Registers a new user account.

- **URL**: `/auth/register`
- **Method**: `POST`
- **Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "type": "User"
}
```

- **Request Headers**:
  - `Content-Type: application/json`

- **Response**:

  - **Success (200 OK)**:

    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "type": "User",
      "_id": "user_id"
    }
    ```

  - **Error (400 Bad Request)**:

    - If a user with the same email and type already exists:

      ```json
      {
        "message": "User with one of unique entries already exists"
      }
      ```

    - If the user type is not one of 'Admin', 'User', or 'Super Admin':

      ```json
      {
        "message": "Invalid User Type"
      }
      ```

  - **Error (500 Internal Server Error)**:

    - If there is a server error:

      ```json
      {
        "error": "Internal server error message"
      }
      ```

### Login User

Logs in a user and provides an authentication token.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Request Body**:

```json
{
  "email": "john@example.com",
  "password": "password123",
  "type": "User"
}
```

- **Request Headers**:
  - `Content-Type: application/json`

- **Response**:

  - **Success (201 Created)**:

    ```json
    {
      "token": "authentication_token",
      "user": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "type": "User",
        "_id": "user_id"
      },
      "message": "Login Successful"
    }
    ```

  - **Error (400 Bad Request)**:

    - If the user does not exist:

      ```json
      {
        "message": "User does not exist"
      }
      ```

    - If the provided credentials are invalid:

      ```json
      {
        "message": "Invalid Credentials"
      }
      ```

  - **Error (500 Internal Server Error)**:

    - If there is a server error:

      ```json
      {
        "error": "Internal server error message"
      }
      ```

---
