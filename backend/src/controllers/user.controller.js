import bcrypt from "bcrypt";
import { IS_PRODUCTION } from "../config/config.js";
import { user } from "../models/user.model.js";
import color from "chalk"; // Assuming the model is named User.js
import generateJWT from "../helpers/generateJWT.js";
import { uploadImage } from "../helpers/cloudinary.js";
import fs from "fs-extra";
import { publications } from "../models/publications.model.js";

export const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const searchEmail = await user.find({ emails: email }).exec();

    if (!searchEmail.length == 0)
      return res
        .status(406)
        .json({ message: "usuario ya existe con ese email" });

    const searchUsername = await user.find({ usernames: username }).exec();

    if (!searchUsername.length == 0)
      return res
        .status(406)
        .json({ message: "usuario ya existe con ese nombre de usuario " });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new user({
      usernames: username,
      passwords: hashedPassword,
      emails: email,
    });

    await newUser.save();

    return res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    console.log(
      color.blue(
        "----------------------------------------------------------------------------------------------------"
      )
    );
    console.log(
      color.red(
        "                           Error en el controlador de registros de usuarios"
      )
    );
    console.log(
      color.blue(
        "----------------------------------------------------------------------------------------------------"
      )
    );
    console.error();
    console.error(error);
    console.error();
    console.log(
      color.blue(
        "----------------------------------------------------------------------------------------------------"
      )
    );
    res.status(500).json({
      message: "Ocurrió un error inesperado por favor intente mas tarde",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userSearched = await user.findOne({ emails: email });
    if (!userSearched)
      return res.status(401).json({ message: "Invalid email" });
    const isValidPassword = await bcrypt.compare(
      password,
      userSearched.passwords
    );
    if (!isValidPassword)
      return res.status(401).json({ message: "Invalid password" });
    const token = await generateJWT(userSearched._id);
    req.session.token = token;
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: IS_PRODUCTION === "production",
      sameSite: IS_PRODUCTION === "production" ? "None" : "Lax",
      maxAge: 3600000,
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.log(
      color.blue(
        "----------------------------------------------------------------------------------------------------"
      )
    );
    console.log(
      color.red(
        "                                Error en el controlador de Accesos"
      )
    );
    console.log(
      color.blue(
        "----------------------------------------------------------------------------------------------------"
      )
    );
    console.error();
    console.error(error);
    console.error();
    console.log(
      color.blue(
        "----------------------------------------------------------------------------------------------------"
      )
    );
    return res
      .status(500)
      .json({ message: "Erro inesperado por favor intente mas tarde" });
  }
};

export const secureAccess = (req, res) => {
  try {
    if (!req.user)
      return res.json({ message: "El usuario no a iniciado session " });
    res.json({
      message: "acceso concedido ",
      user: { id: req.user._id, role: req.user.role },
    });
  } catch (error) {
    console.log(
      color.blue(
        "----------------------------------------------------------------------------------------------------"
      )
    );
    console.log(
      color.red(
        "                                        Error en el controlador de sesiones de Usuarios"
      )
    );
    console.log(
      color.blue(
        "----------------------------------------------------------------------------------------------------"
      )
    );
    console.error();
    console.error(error);
    console.error();
    console.log(
      color.blue(
        "----------------------------------------------------------------------------------------------------"
      )
    );
    res
      .status(500)
      .json({ message: "Error inesperado por favor intente mas tarde " });
  }
};

export const logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err)
        return res.status(500).json({ message: "Error al cerrar sesión" });

      res.clearCookie("authToken");

      return res.json({ success: true, message: "Cierre de sesión exitoso" });
    });
  } catch (error) {
    console.log(
      color.blue(
        "----------------------------------------------------------------------------------------------------"
      )
    );
    console.log(
      color.red(
        "                               Erro en el controlador de cerrar session "
      )
    );
    console.log(
      color.blue(
        "----------------------------------------------------------------------------------------------------"
      )
    );
    console.error();
    console.error(error);
    console.error();
    console.log(
      color.blue(
        "----------------------------------------------------------------------------------------------------"
      )
    );
    res
      .status(500)
      .json({ message: "Error inesperado por favor intente de nuevo " });
  }
};

export const profileUpdater = async (req, res) => {
  try {
    const { id } = req.user;
    const { email, username } = req.body;

    // Crear objeto para los campos actualizados
    let updatedFields = {};

    if (email) {
      const searchEmail = await user.find({ emails: email }).exec();
      if (searchEmail.length > 0) {
        return res
          .status(406)
          .json({ message: "Usuario ya existe con ese email" });
      }
      updatedFields.emails = email;
    }

    if (username) {
      const searchUsername = await user.find({ usernames: username }).exec();
      if (searchUsername.length > 0) {
        return res
          .status(406)
          .json({ message: "Usuario ya existe con ese nombre de usuario" });
      }
      updatedFields.usernames = username;
    }

    if (req.files?.media) {
      const media = req.files.media;
      if (media.mimetype !== "image/jpeg" && media.mimetype !== "image/png") {
        return res.status(400).json({ message: "Formato de imagen no válido" });
      }
      const rout = media.tempFilePath;
      const result = await uploadImage(rout);
      updatedFields.profilePicture = {
        _id: result.public_id,
        url: result.secure_url,
      };
      fs.unlink(rout);
    }

    const userUpdated = await user.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true }
    );

    if (!userUpdated) {
      return res
        .status(404)
        .json({ message: "No se pudo actualizar el usuario" });
    }

    return res.status(200).json({
      message: "Perfil actualizado con éxito",
      profilePicture: userUpdated.profilePicture,
    });
  } catch (error) {
    console.error("Error en el controlador de actualización de usuario", error);
    return res
      .status(500)
      .json({ message: "Error inesperado, intente más tarde" });
  }
};

export const getLoggedUser = async (req, res) => {
  try {
    const { id } = req.user; // Asumiendo que ya has verificado el token y tienes el `id` del usuario

    const userLogged = await user
      .findById(id)
      .select("usernames emails profilePicture likedPublications")
      .exec();

    if (!userLogged) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({
      username: userLogged.usernames,
      email: userLogged.emails,
      profilePicture: userLogged.profilePicture,
      likedPublications: userLogged.likedPublications,
    });
  } catch (error) {
    console.error("Error al obtener el usuario logueado:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener el usuario logueado" });
  }
};

export const getUserPublications = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    const userPublications = await publications
      .find({ idUsers: userId })
      .populate("idUsers", "username email profilePicture");
    if (userPublications.length === 0) {
      return res.status(404).json({ message: "No tienes publicaciones" });
    }
    return res.status(200).json(userPublications);
  } catch (error) {
    console.error("Error al obtener publicaciones del usuario", error);
    return res
      .status(500)
      .json({ message: "Error inesperado en el servidor. Intente más tarde" });
  }
};
