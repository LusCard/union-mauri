import mongoose from "mongoose";
mongoose.set("strictPopulate", false);
const reqModel = new mongoose.Schema({
  user: { type: String, require: true },
  email: { type: String, require: true },
  titles: { type: String, require: true, trim: true },
  idUsers: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  descriptions: { type: String, require: true, trim: true },
  locations: { lat: { type: Number }, long: { type: Number } },
  category: { type: String, require: true },
  medias: {
    photos: [{ _id: String, url: String }],
    videos: [{ _id: String, url: String }],
  },
  startDates: { type: Date, require: true },
  endDates: { type: Date, require: true },
  idUser: { type: String, require: true },
});

const request = mongoose.model("Request", reqModel);
export default request;
