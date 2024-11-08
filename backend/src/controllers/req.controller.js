import mongoose from "mongoose";
import request from "../models/req.model.js";
import { publications } from "../models/publications.model.js";
import color from "chalk";

// Send a new request
export const creatorRequest = async (req, res) => {
  try {
    const { description } = req.body;
    const { emails, usernames, _id } = req.user;

    const newRequest = new request({
      user: usernames,
      email: emails,
      descriptions: description,
      idUser: _id,
    });

    const status = await newRequest.save();

    if (!status)
      return res
        .status(404)
        .json({ message: "no se puedo hacer el envío de la petición" });

    res.status(200).json({ message: "petición enviada con éxito" });
  } catch (error) {
    console.error("Error al enviar una petición al servidor:", error);
    return res.status(500).json({ message: "Error al enviar la petición" });
  }
};

// Get all requests (admin only)
export const getAllRequest = async (req, res) => {
  try {
    if (!req.user.isAuthorized)
      return res.status(401).json({
        message: "no tienes autorización para realizar estas acciones",
      });

    const allRequests = await request.find().exec();
    res.status(200).json(allRequests);
  } catch (error) {
    console.error(
      "Error en el controlador de traer todas las peticiones:",
      error
    );
    res.status(500).json({ message: "Error al obtener peticiones" });
  }
};

// Accept a request
export const acceptRequest = async (req, res) => {
  try {
    if (!req.user.isAuthorized)
      return res.status(401).json({
        message: "no tienes autorización para realizar estas acciones",
      });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ message: "La id del parámetro no es válida" });

    const foundRequest = await request.findById(id).exec();
    if (!foundRequest)
      return res.status(404).json({ message: "No se encontró la petición" });

    // Create publication with request data
    const newPublication = new publication({
      user: foundRequest.user,
      email: foundRequest.email,
      descriptions: foundRequest.descriptions,
      idUser: foundRequest.idUser,
    });
    await newPublication.save();

    // Delete request after accepting
    await request.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Petición aceptada y publicada correctamente" });
  } catch (error) {
    console.error(
      "Error en el controlador de aceptación de peticiones:",
      error
    );
    res.status(500).json({ message: "Error al aceptar la petición" });
  }
};

// Deny a request
export const denialsRequests = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ message: "La id del parámetro no es válida" });

    const reqDeleted = await request.findByIdAndDelete(id);
    if (!reqDeleted)
      return res
        .status(304)
        .json({ message: "No se pudo eliminar la petición, intente de nuevo" });

    res
      .status(200)
      .json({ message: "Petición denegada y eliminada correctamente" });
  } catch (error) {
    console.error(
      "Error en el controlador de denegación de peticiones:",
      error
    );
    res.status(500).json({ message: "Error al denegar la petición" });
  }
};
