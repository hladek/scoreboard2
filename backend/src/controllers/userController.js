const userService = require('../services/userService');

class UserController {
  async signup(req, res) {
    try {
      const { username, email, password, affiliation, secret } = req.body;

      if (!username || !email || !password || !affiliation || !secret) {
        return res.status(400).json({ error: 'Username, email, password, affiliation, and secret are required' });
      }

      const user = await userService.createUser(username, email, password, affiliation, secret);
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(409).json({ error: 'Username or email already exists' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const userDetails = req.body;
      const user = await userService.updateUser(id, userDetails);
      res.json({ message: 'User updated successfully', user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const result = await userService.login(username, password);
      res.json({ message: 'Login successful', ...result });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async logout(req, res) {
    // In a token-based auth system, logout is typically handled client-side
    // by removing the token. We just acknowledge the request.
    res.json({ message: 'Logout successful' });
  }

  async listUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
