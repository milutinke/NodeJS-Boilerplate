// Damn Mysql2 lib
// Workaround
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

const App = require('../App');
const Supertest = require('supertest');
const Request = Supertest(App);

let token;
let User = {
    firstName: "Dusan",
    lastName: "Milutinovic",
    email: "milutinke@gmx.com",
    username: "milutinke",
    password: "SomeTestPassword123",
    repeatPassword: "SomeTestPassword123",
    country: "Serbia"
};

describe('User', function () {
    it('should register', async done => {
        const response = await Request.post('/user/register')
            .set('Accept', 'application/json')
            .send(User);

        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('token');
        expect(response.status).toBe(201);

        if (response.body.token)
            token = response.body.token;

        done();
    });

    it('should login', async done => {
        const response = await Request.post('/user/login')
            .set('Accept', 'application/json')
            .send(User);

        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('token');
        expect(response.status).toBe(200);

        done();
    });

    it('should pass authorisation', async done => {
        if (!token)
            fail('No token provided, not a successfull registration!');

        const response = await Request.post('/user/test')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(User);

        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('token');
        expect(response.status).toBe(200);

        done();
    });
});