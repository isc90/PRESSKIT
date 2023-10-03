# BACKEND PARA PRESSKIT G21-WEB-A

Endpoints

- registerUser
http://localhost:5001/api/v1/register

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
http://localhost:5001/api/v1/login

Login{
email: String,
password: String
}

-getInfo publica
http://localhost:5001/api/v1/profile/nickname


getInfo privada
http://localhost:5001/api/v1/me
Bearer Token Header


-updateUser
http://localhost:5001/api/v1/editMyInfo/:id
Bearer Token Header
