# **Excel Converter with Google Gemini Integration**  

This project is a **Node.js application** that allows users to upload PDF files, process their content using **Google Gemini AI**, and download the extracted data as an Excel sheet. It features a **user-friendly interface** built with **EJS** and **Bootstrap** for seamless interaction.  

---

## **🛠 Features**  
- **Upload PDF files.**  
- **Extract structured content** from PDFs using Google Gemini AI.  
- **Download the extracted content** in Excel format.  
- File state monitoring for smooth processing.  
- **Responsive and visually appealing UI.**  

---

## **🚀 Getting Started**  

### **1️⃣ Prerequisites**  
Ensure you have the following installed on your system:  
- **Node.js** (v18 or higher)  
- **npm** or **yarn**  
- **Google Gemini API Key** (Sign up at Google AI for access)  

### **2️⃣ Installation**  

#### **Clone the repository:**  
```bash  
git clone https://github.com/shakibkumnale/aiexcelconverter  
cd excel-converter  
```  

#### **Install dependencies:**  
```bash  
npm install  
```  

#### **Set up your environment variables:**  
1. Create a `.env` file in the root directory.  
2. Add your Google Gemini API key:  
```env  
GEMINI_API_KEY=your-google-gemini-api-key  
```  

### **3️⃣ Usage**  
#### **Start the server:**  
```bash  
npm start  
```  
- The application will run at **http://localhost:3000**.  

#### **Upload and process a file:**  
1. Open the application in your browser.  
2. **Upload a PDF file** using the provided form.  
3. Wait for the file to process.  
4. **Download the generated Excel file** using the **Download Excel** button.  

---

## **📂 Project Structure**  

```bash  
aiexcelconverter/  
│  
├── public/  
│    └── example.pdf   # Demo file for testing  
│   
├── views/  
│   ├── index.ejs     # Main UI template  
│   ├── editor.ejs    # Middleware to check JSON format  
│   └── result.ejs    # Result page  
│  
├── app.js            # Main application logic  
├── .env              # Environment variables (not committed to Git)  
├── README.md         # Project documentation  
└── package.json      # Node.js dependencies  
```  

---

## **📄 Example PDF**  
You can find a demo PDF file for testing in the **`public` folder**:  

```bash  
/public/example.pdf  
```  
Use this file to test the application's functionality.  

---

## **🔧 Troubleshooting**  
- **File not processing:** Ensure the file is a valid PDF and meets the size limit.  
- **Google Gemini API errors:** Verify your API key is correctly set in `.env`.  
- **Server errors:** Check the console logs for detailed error messages.  

---

## **🤝 Contributing**  
Contributions are welcome! To contribute:  
1. Fork the repository.  
2. Create a new branch:  
   ```bash  
   git checkout -b feature-name  
   ```  
3. Make your changes and commit:  
   ```bash  
   git commit -m 'Added feature'  
   ```  
4. Push to your branch:  
   ```bash  
   git push origin feature-name  
   ```  
5. Open a Pull Request.  

---

## **📜 License**  
This project is licensed under the **MIT License**.  

---

## **✨ Acknowledgements**  
- **Google Gemini API** for AI-powered PDF processing.  
- **Bootstrap** for the responsive frontend.  
- **Community** for feedback and inspiration.  