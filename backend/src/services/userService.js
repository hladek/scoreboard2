const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');

class UserService {
  async createUser(username, email, password, isAdmin = false) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [userId] = await db('users').insert({
      username,
      email,
      password: hashedPassword,
      is_admin: isAdmin
    });

    const user = await db('users').where({ id: userId }).first();
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
      { userId: user.id, username: user.username, isAdmin: user.is_admin },
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
