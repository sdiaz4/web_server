const request = require('supertest');

const { describe, it, expect } = require('@jest/globals');
const app = require('../../lib/app/app.js')

describe('project tests', () => {
    it('should respond to requests for /hello', () => 
        request(app).get('/hello').expect(200)
    );
    it('should respond to any other request', () => 
        request(app).get('/whatwasthisforagain?').expect(404)
    );
})
