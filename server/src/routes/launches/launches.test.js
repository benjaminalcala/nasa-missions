const request = require('supertest');
const app = require('../../app');


describe('Test /GET launches', () => {
  test('returns 200 ok', async() => {
    await request(app)
    .get('/launches')
    .expect('Content-Type', /json/)
    .expect(200)
  })

})

describe('Test /POST launches', () => {
  const launchData = {
    mission: 'Kepler Enterprise',
    rocket: 'NCC 1701-D',
    target: 'Kepler-188 AF',
    launchDate: 'January 1, 2030'
  }

  const launchDataWithoutDate = {
    mission: 'Kepler Enterprise',
    rocket: 'NCC 1701-D',
    target: 'Kepler-188 AF'
  }

  const launchDataWithInvalidDate = {
    mission: 'Kepler Enterprise',
    rocket: 'NCC 1701-D',
    target: 'Kepler-188 AF',
    launchDate: 'invalid',
  }

  test('returns 201 created', async() => {
    const response = await request(app)
    .post('/launches')
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
    .post('/launches')
    .send(launchDataWithoutDate)
    .expect(400)

    expect(response.body).toStrictEqual({
      error: 'missing launch property'
    })
  })

  test('returns 400 bad request when launch date is invalid', async() => {
    const response = await request(app)
    .post('/launches')
    .send(launchDataWithInvalidDate)
    .expect(400)

    expect(response.body).toStrictEqual({
      error: 'invalid launch date'
    })
  })



})