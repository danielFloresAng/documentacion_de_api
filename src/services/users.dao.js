import usersModel from "../models/users.models.js";

class UserService {
  constructor() {
    this.model = usersModel;
  }

  get = async (filter) => {
    try {
      return await this.model.find(filter).lean();
    } catch (error) {
      return error.message;
    }
  };
  getById = async (email) => {
    try {
      return await this.users.findById(email).lean();
    } catch (error) {
      return error.message;
    }
  };

  add = async (firstName, lastName, email, password) => {
    try {
      return await this.model.create({
        firstName,
        lastName,
        email,
        password,
      });
    } catch (error) {
      return error.message;
    }
  };
  update = async (filter, update, options) => {
    try {
        return await usersModel.findOneAndUpdate(filter, update, options);
    } catch (err) {
        return err.message;
    };
};

  delete = async (firstName, lastName, email, password) => {
    try {
      return this.model.deleteOne(firstName, lastName, email, password);
    } catch (error) {
      return error.message;
    }
  };
}

export default UserService;
