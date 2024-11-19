import mongoose from "mongoose";
mongoose.set("strictPopulate", false);
const userModel = new mongoose.Schema({
  usernames: { type: String, required: true, trim: true },
  passwords: { type: String, required: true, trim: true },
  emails: { type: String, required: true, trim: true },
  role: {
    type: String,
    required: true,
    trim: true,
    default: "user",
    enum: ["user", "admin"],
  },
  publications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Publications" }],
  likedPublications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Publications" },
  ],
  profilePicture: {
    _id: { type: String, default: "imagenProyect/afpdiox30acmlfvcskww" },
    url: {
      type: String,
      default:
        "https://res.cloudinary.com/ddwriwzgm/image/upload/v1727374339/imagenProyect/afpdiox30acmlfvcskww.jpg",
    },
  },
});

export const user = mongoose.model("User", userModel);
