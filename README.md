# BACKEND PARA PRESSKIT G21-WEB-A

Endpoints

- registerUser
http://localhost:5001/presskit/users/register

Schema (All fields required to register) {
name: String,
email: String,
password: String,
phone: Number,
city: String,
description: String,
services: String
}


-login
http://localhost:5001/presskit/users/login

Login{
email: String,
password: String
}
