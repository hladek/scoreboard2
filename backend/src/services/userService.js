const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');

class UserService {
  async createUser(username, email, password, affiliation) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [userId] = await db('users').insert({
      username,
      email,
      password: hashedPassword,
      affiliation,
      status: 'new',
      role: 'judge'
    });

    const user = await db('users').where({ id: userId }).first();
    return this.sanitizeUser(user);
  }

  async updateUser(id, userDetails) {
    const { password, ...rest } = userDetails;
    if (password) {
      rest.password = await bcrypt.hash(password, 10);
    }
    await db('users').where({ id }).update(rest);
    return this.getUserById(id);
  }

  async getUserById(id) {
    const user = await db('users').where({ id }).first();
    if (!user) {
      return null;
    }
    return this.sanitizeUser(user);
  }

  async login(username, password) {
    const user = await db('users').where({ username }).first();
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token, user: this.sanitizeUser(user) };
  }

  async getAllUsers() {
    const users = await db('users').select('*');
    return users.map(user => this.sanitizeUser(user));
  }

  sanitizeUser(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = new UserService();
