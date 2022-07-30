const request = require('supertest');

const app = require('../../app');
const {mongoConnect, mongoDisconnect} = require('../../utils/mongo');


describe('Launches API', ()=> {
  beforeAll(async()=> {
    await mongoConnect()
  })

  afterAll(async()=> {
    await mongoDisconnect()
  })

  describe('Test /GET launches', () => {
    test('returns 200 ok', async() => {
      await request(app)
      .get('/v1/launches')
      .expect('Content-Type', /json/)
      .expect(200)
    })
  
  })
  
  describe('Test /POST launches', () => {
    const launchData = {
      mission: 'Kepler Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'January 1, 2030'
    }
  
    const launchDataWithoutDate = {
      mission: 'Kepler Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f'
    }
  
    const launchDataWithInvalidDate = {
      mission: 'Kepler Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'invalid',
    }
  
    test('returns 201 created', async() => {
      const response = await request(app)
      .post('/v1/launches')
      .send(launchData)
      .expect('Content-Type', /json/)
      .expect(201)
  
      const responseDate = new Date(response.body.launchDate).valueOf()
      const requestDate = new Date(launchData.launchDate).valueOf();
  
      expect(responseDate).toBe(requestDate)
      expect(response.body).toMatchObject(launchDataWithoutDate)
    })
  
    test('returns 400 bad request when launch date is not included', async() => {
      const response = await request(app)
      .post('/v1/launches')
      .send(launchDataWithoutDate)
      .expect(400)
  
      expect(response.body).toStrictEqual({
        error: 'missing launch property'
      })
    })
  
    test('returns 400 bad request when launch date is invalid', async() => {
      const response = await request(app)
      .post('/v1/launches')
      .send(launchDataWithInvalidDate)
      .expect(400)
  
      expect(response.body).toStrictEqual({
        error: 'invalid launch date'
      })
    })
  
  
  
  })



})


