## Smart-Docs-API

## Api

### Users

`GET /api/accountants`

Response

```json
[
  {
    "id": 1,
    "name": "Ahmed Murad",
    "company": "Careful Counting",
    "email": "a.murad@nomail.com"
  }
]
```

`GET /api/user/categories/list/:email`

Response:

```json
[
  { "id": 1,
  "name": "personal",
  "accountant_company":"Penny Pinchers"
  }
]
```

`GET /user/reciepts`

Response:

```json
[
  {"category_id": 3,
  "id": 3,
  "name": "test",
  "upload_date": "2020-01-10T17:59:43.341Z"}
]
```

### Accountants

`POST /api/accountant`

Body

```json
[
  {
    "token":"...................."
  }
]

Response

```json
[
  {
    "id": 1,
    "name": Ahmed Murad,
    "company": "Careful Counting",
    "email": "a.murad@nomail.com",
    "users": [
      {
        "email": "hi@me.com",
        "id":16,
        "name": "hi@me.com"
      }
             ]
  }
]
```



## Author

- Ahmed Murad

## Getting Started

Install all dependencies (using the npm install command).
Copy and create .env file and add your API keys.
Run the server using the npm run watch.
