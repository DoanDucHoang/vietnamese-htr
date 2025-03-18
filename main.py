from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from vietocr.tool.predictor import Predictor
from vietocr.tool.config import Cfg
from PIL import Image
import io

app = FastAPI()

# ✅ Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

# Load model VietOCR
config = Cfg.load_config_from_file("config.yml")
config["weights"] = "weights/transformerocr.pth"
config["device"] = "cuda:0"
detector = Predictor(config)

@app.post("/predict/")
async def predict_text(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read()))
    text = detector.predict(image)
    return {"text": text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
