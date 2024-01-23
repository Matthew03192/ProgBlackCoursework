'use strict';

const request = require('supertest');
const app = require('./node');

describe('Test the things service', () => {
    test('GET /random succeeds', () => {
        return request(app)
	    .get('/random')
	    .expect(200);
    });
})