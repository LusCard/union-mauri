import mongoose from "mongoose";
import request from "../models/req.model.js";
import { publications } from "../models/publications.model.js";
import { uploadImage, uploadVideo } from "../helpers/cloudinary.js";
import color from "chalk";

// Send a new request
export const creatorRequest = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { titles, descriptions, category, startDates, endDates } = req.body;
    const { lat, long } = JSON.parse(req.body.locations);
    const idUser = req.user._id;

    // Validar campos obligatorios
    if (
      !titles ||
      !descriptions ||
      !lat ||
      !long ||
      !category ||
      !startDates ||
      !endDates
    ) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const mediaFiles = req.files?.media
      ? Array.isArray(req.files.media)
        ? req.files.media
        : [req.files.media]
      : [];
    console.log("Media Files:", mediaFiles);

    const photos = [];
    const videos = [];

    if (mediaFiles.length > 0) {
      await Promise.all(
        mediaFiles.map(async (file) => {
          try {
            console.log("Processing file:", file);
            let result;
            if (file.mimetype.startsWith("image/")) {
              result = await uploadImage(file.tempFilePath);
              photos.push({
                _id: new mongoose.Types.ObjectId().toString(),
                url: result.secure_url,
              }); // Agrega objeto de foto
            } else if (file.mimetype.startsWith("video/")) {
              result = await uploadVideo(file.tempFilePath);
              videos.push({
                _id: new mongoose.Types.ObjectId().toString(),
                url: result.secure_url,
              }); // Agrega objeto de video
            }
          } catch (uploadError) {
            console.error("Error al procesar el archivo:", uploadError);
            throw new Error("Error al procesar el archivo multimedia");
          }
        })
      );
    } else {
      console.log("No media files to process.");
    }

    const newPublicationRequest = new request({
      titles,
      idUsers: idUser,
      descriptions,
      locations: { lat, long },
      category,
      startDates,
      endDates,
      medias: {
        photos,
        videos,
      },
    });
    console.log("New Publication Request:", newPublicationRequest);

    await newPublicationRequest.save();

    // Mover la eliminación de archivos aquí para asegurarte de que solo se eliminen si la creación fue exitosa
    await Promise.all(mediaFiles.map((file) => fs.unlink(file.tempFilePath)));

    return res.status(201).json({
      message: "Peticion creada exitosamente",
      requestId: newPublicationRequest._id,
    });
  } catch (error) {
    console.error("Error al crear la peticion de publicación", error);
    return res
      .status(500)
      .json({ message: "Error inesperado en el servidor. Intente más tarde" });
  }
};

// Get all requests (admin only)
export const getAllRequest = async (req, res) => {
  try {
    const allRequests = await request
      .find()
      .populate({ path: "idUsers", select: "usernames" })
      .exec();
    console.log("All Requests ahre:", allRequests);
    res.status(200).json(allRequests);
  } catch (error) {
    console.error(
      "Error en el controlador de traer todas las peticiones:",
      error
    );
    res.status(500).json({ message: "Error al obtener peticiones" });
  }
};

// Accept a request and send to publications
export const acceptRequest = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({
        message: "no tienes autorización para realizar estas acciones",
      });
    console.log("Request to accept:", req.params);
    const { id } = req.params;
    const foundRequest = await request.findById(id).exec();
    if (!foundRequest)
      return res.status(404).json({ message: "No se encontró la petición" });

    // Create publication with request data
    const newPublication = new publications({
      titles: foundRequest.titles,
      idUsers: foundRequest.idUsers,
      descriptions: foundRequest.descriptions,
      locations: foundRequest.locations,
      category: foundRequest.category,
      startDates: foundRequest.startDates,
      endDates: foundRequest.endDates,
      medias: foundRequest.medias,
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
