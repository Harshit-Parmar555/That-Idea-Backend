import fs from "fs";
import { bucket } from "./firebase.config.js";

// Image upload function to firebase
const uploadImageToFirebase = async (file) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    const localFilePath = file.path;
    const uniqueFileName = `${Date.now()}_${file.originalname}`;
    const firebaseFile = bucket.file(uniqueFileName);

    // Upload file to Firebase Storage
    await firebaseFile.save(fs.readFileSync(localFilePath), {
      metadata: { contentType: file.mimetype },
    });

    // Make the file publicly accessible
    await firebaseFile.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFileName}`;

    // Delete the local file after successful upload
    fs.unlinkSync(localFilePath);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export { uploadImageToFirebase };
