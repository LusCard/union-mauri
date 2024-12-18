import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config.js";

export default (id, role) => {
  return new Promise((resolve, reject) => {
    const payLoad = { id, role };
    jwt.sign(
      payLoad,
      SECRET_KEY,
      {
        expiresIn: "7d",
      },
      (error, token) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
};
