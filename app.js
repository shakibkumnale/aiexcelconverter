const express = require("express");
const multer = require("multer");
const ExcelJS = require("exceljs");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware for EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for static files
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Multer setup
const upload = multer({ dest: "uploads/" });


// Google AI API configuration
const apiKey =process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8000,
  responseMimeType: "text/plain",
};

// Upload file to Gemini
async function uploadToGemini(filePath, mimeType) {
  const uploadResult = await fileManager.uploadFile(filePath, {
    mimeType,
    displayName: filePath,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}


// Wait for file processing
async function waitForFilesActive(files) {
  console.log("Waiting for file processing...");
  for (const name of files.map((file) => file.name)) {
    let file = await fileManager.getFile(name);
    while (file.state === "PROCESSING") {
      process.stdout.write(".");
      await new Promise((resolve) => setTimeout(resolve, 10000));
      file = await fileManager.getFile(name);
    }
    if (file.state !== "ACTIVE") {
      throw Error(`File ${file.name} failed to process`);
    }
  }
  console.log("...all files ready\n");
}

// Route for home page
app.get("/", (req, res) => {
  res.render("index");
});

// Endpoint to process PDF
app.post("/process-pdf", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const mimeType = "application/pdf";

    // Upload file to Gemini AI
    const geminiFile = await uploadToGemini(filePath, mimeType);
    await waitForFilesActive([geminiFile]);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `
        Extract content from the PDF:
        Name, Father's Name, House Number(if not given then null), Age, Gender, VoterId.
        Respond in JSON format, e.g.:
        [{"id":1, "Name":"John Doe", "Father's Name":"Richard Doe", "House Number":"123", "Age":30, "Gender":"Male", "VoterId":"XYZ123"}]
      `,
    });

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: geminiFile.mimeType,
                fileUri: geminiFile.uri,
              },
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("Extract voter details from this file.");
     console.log(result.response.text())
    const extractedData =result.response.text()
    res.render("editor", { data: extractedData });
      } catch (err) {
    console.error("Error processing file:", err);
    res.render("result", {
      csvFile: null,
      error: "An error occurred while processing the file.",
    });
  } finally {
    fs.unlinkSync(req.file.path); // Cleanup uploaded file
  }
});
app.post("/convert-to-excel", (req, res) => {
    try {
      const extractedData = JSON.parse(req.body.jsonData);
  
      // Convert JSON to Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Extracted Data");
  
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Name", key: "Name", width: 30 },
        { header: "Father's Name", key: "FathersName", width: 30 },
        { header: "House Number", key: "HouseNumber", width: 15 },
        { header: "Age", key: "Age", width: 10 },
        { header: "Gender", key: "Gender", width: 10 },
        { header: "Voter ID", key: "VoterId", width: 20 },
      ];
  
      extractedData.forEach((data, index) => {
        worksheet.addRow({
          id: index + 1,
          Name: data["Name"],
          FathersName: data["Father's Name"],
          HouseNumber: data["House Number"] || "null",
          Age: data["Age"],
          Gender: data["Gender"],
          VoterId: data["VoterId"],
        });
      });
  
      const outputPath = path.join(__dirname, "output.xlsx");
      workbook.xlsx.writeFile(outputPath).then(() => {
        // Send the Excel file as response
        res.download(outputPath, "ExtractedData.xlsx", (err) => {
          if (err) {
            console.error("Error sending file:", err);
          }
          fs.unlinkSync(outputPath); // Delete the file after sending
        });
      });
    } catch (err) {
      console.error("Error converting to Excel:", err);
      res.status(500).send("An error occurred while converting to Excel.");
    }
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
