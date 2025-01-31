process.env.PORT = 3001;
const request = require('supertest');
const app = require('../app');  


beforeAll(() => {
  const port = process.env.PORT || (3000 + Math.floor(Math.random() * 1000));
  server = app.listen(port);
});

afterAll(() => {
  server.close();
});

describe('User API', () => {
    it('should get all users', async () => {
        const response = await request(app).get('/users');
        expect(response.status).toBe(200); 
        expect(Array.isArray(response.body)).toBe(true); 
      });

      it('should get a user by id', async () => {
        const userId = 'uuid-id';  
        const response = await request(app).get(`/users/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', userId); 
      });
    
      
      it('should create a new user', async () => {
        const newUser = {
          name: 'Bibbel',
          email: 'Bibbel@gmail.com',
          age: 28
        };
        const response = await request(app)
          .post('/users')
          .send(newUser); 
    
        expect(response.status).toBe(201); 
        expect(response.body).toHaveProperty('id'); 
      });
    
    
      it('should update a user', async () => {
        const userId = 'uuid-id'; 
        const updatedUser = {
          name: 'Dimas',
          email: 'Dimas@gmail.com',
          age: 30
        };
        const response = await request(app)
          .put(`/users/${userId}`)
          .send(updatedUser);
    
        expect(response.status).toBe(200);  
        expect(response.body).toHaveProperty('name', 'Dimas');  
      });
    
    
      it('should delete a user', async () => {
        const userId = 'uuid-id';  
        const response = await request(app).delete(`/users/${userId}`);
        expect(response.status).toBe(200);  
        expect(response.body.message).toBe('User deleted'); 
      });
    
    });


