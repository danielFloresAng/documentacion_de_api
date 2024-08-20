import UserService from "../services/users.dao.js";
import { createHash } from "../services/utils.js";

const service = new UserService();

class UserDTO {
  constructor(userData) {
    this.data = userData;
    this.data.lastName = this.data.lastName.toUpperCase();
    this.data.password = createHash(this.data.password);
    this.data.orders = [];
  }
}

// const normalize = new userDTO(userData);

class UserManager {
  constructor(user) {
    this.users = user;
  }

  getUser = async (filter) => {
    try {
      return await service.get(filter);
    } catch (error) {
      return error.message;
    }
  };
  getUserById = async (id) => {
    try {
      return await this.users.findById(id).lean();
    } catch (error) {
      return error.message;
    }
  };

  addUser = async (newData) => {
    try {
      const normalize = new UserDTO(newData);
      return await service.add(normalize.userData);
    } catch (error) {
      return error.message;
    }
  };
  updateUserData = async (filter, update, options) => {
    try {
      return await service.update(filter, update, options);
    } catch (err) {
      return err.message;
    }
  };

  deleteUser = async (data) => {
    try {
      return await service.delete(data);
    } catch (error) {
      return error.message;
    }
  };
}

export default UserManager;
