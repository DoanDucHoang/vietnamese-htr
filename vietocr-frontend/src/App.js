import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [image, setImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setFile(file);
    if (file) { 
      const reader = new FileReader();
      reader.onload = () => { 
        setImage(reader.result);
      }
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Vui lòng chọn một ảnh!");
    
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data.text);
    } catch (error) {
      console.error("Lỗi:", error);
      setResult("Lỗi khi nhận diện.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>📝 Nhận diện chữ viết tay</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {image && (
        <div>
          <img src={image} alt="Preview" style={{ width: "800px", marginTop: "10px" }} />
        </div>
      )}
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>Nhận diện</button>
      <p><strong>Kết quả:</strong> {result}</p>
    </div>
  );
}

export default App;
