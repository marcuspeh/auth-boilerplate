# Auth Boilerplate for backend
View `docs/backend.md` for more info about the endpoints

# Features
* Authentication system
* RSA encryption for sending sensitive data

# Tech Stack
* Koa
* NodeJs
* Postgres

# Potential Technologies
* **[ag-grid](https://www.ag-grid.com/)**: for loading huge amount of data in table
* **[k6](https://k6.io/)**: use for load testing
* **[tensorflow.sg](https://www.tensorflow.org/js)**: to use tensorflow in js
* **[Rapid API](https://rapidapi.com/)**: to manage api

# Cron Job
* There is a cron job scheduled to run every day to clear expired tokens from db.
* This could be done in a seperate node server but since it is lightweight, it will be done in the backend folder