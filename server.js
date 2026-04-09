const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());  // dopušta pristup s drugih domena

// Provjeri postoji li folder uploads
const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Serviranje uploadanih datoteka
app.use("/uploads", express.static(uploadFolder));

// Multer za upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname)
});
const upload = multer({ storage });

// Endpoint za upload
app.post("/upload", upload.array("media"), (req, res) => {
  res.json({ status: "ok" });
});

// Endpoint za dohvat svih medija
app.get("/media", (req, res) => {
  const files = fs.readdirSync(uploadFolder);
  const data = files.map(file => {
    const ext = path.extname(file).toLowerCase();
    const type = ext === ".mp4" || ext === ".webm" ? "video/mp4" : "image";
    return { url: `/uploads/${file}`, type };
  });
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));