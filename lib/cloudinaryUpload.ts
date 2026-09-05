import cloudinary from "./cloudinary";
// Flow in next.js
// Browser -> File object -> arrayBuffer() -> Buffer -> Base64 -> Data URI -> cloudinary.uploader.upload() -> Cloudinary

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const MAX_SIZE_MB = 5;

const cloudinaryUpload = async (file: File) => {
  //   console.log(file);
  //   console.log(file.type);

  if (!file) return null;

  const extension = file.name.split(".").pop()?.toLowerCase();
  const isValidType =
    ALLOWED_TYPES.includes(file.type) ||
    ALLOWED_EXTENSIONS.includes(extension ?? "");

  if (!isValidType) {
    console.error("Invalid file type:", file.type, extension);
    return null;
  }

  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > MAX_SIZE_MB) {
    console.error("File is too large:", fileSizeMB.toFixed(2) + "MB");
    return null;
  }
  try {
    // this flow because no filesystem like express here like fs.file
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType =
      file.type || `image/${extension === "jpg" ? "jpeg" : extension}`;
    const dataUri = `data:${mimeType};base64,${base64}`;

    const uploadResponse = await cloudinary.uploader.upload(dataUri, {
      resource_type: "image",
    });

    // console.log("cloudinary upload", uploadResponse);

    return uploadResponse;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return null;
  }
};

export default cloudinaryUpload;
