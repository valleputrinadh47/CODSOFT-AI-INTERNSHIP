import os
import secrets
import threading
from flask import Flask, render_template, request, url_for

missing_deps = []

try:
    from PIL import Image
except ImportError:
    Image = None
    missing_deps.append("Pillow")

try:
    from transformers import BlipProcessor, BlipForConditionalGeneration
except ImportError:
    BlipProcessor = None
    BlipForConditionalGeneration = None
    missing_deps.append("transformers")

try:
    from werkzeug.utils import secure_filename
except ImportError:
    secure_filename = None
    missing_deps.append("werkzeug")

app = Flask(__name__)
UPLOAD_FOLDER = os.path.join(app.root_path, "static", "uploads")
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

processor = None
model = None
model_lock = threading.Lock()

MODEL_NAME = "Salesforce/blip-image-captioning-base"

def load_model():
    global processor, model
    if BlipProcessor is None or BlipForConditionalGeneration is None:
        raise RuntimeError("Required package 'transformers' is not installed.")

    if processor is None or model is None:
        with model_lock:
            if processor is None or model is None:
                print("Loading AI model... Please wait.")
                processor = BlipProcessor.from_pretrained(MODEL_NAME)
                model = BlipForConditionalGeneration.from_pretrained(MODEL_NAME)
                print("Model loaded successfully!")

@app.route("/", methods=["GET", "POST"])
def home():

    caption = ""
    error = ""
    image_url = ""

    if missing_deps:
        error = (
            "Missing dependencies: "
            + ", ".join(missing_deps)
            + ". Install them with pip and restart the app."
        )

    if request.method == "POST" and not missing_deps:

        image_file = request.files.get("image")

        if not image_file or image_file.filename == "":
            error = "No image uploaded. Please choose an image file."
        else:
            try:
                if secure_filename is None:
                    raise RuntimeError("Required package 'werkzeug' is not installed.")

                filename = secure_filename(image_file.filename)
                if not filename:
                    filename = f"image-{secrets.token_hex(8)}.png"
                unique_filename = f"{secrets.token_hex(8)}-{filename}"
                save_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)
                image_file.save(save_path)
                image_url = url_for("static", filename=f"uploads/{unique_filename}")

                load_model()
                if Image is None:
                    raise RuntimeError("Required package 'Pillow' is not installed.")

                image = Image.open(save_path).convert("RGB")
                inputs = processor(
                    images=image,
                    return_tensors="pt"
                )
                output = model.generate(
                    **inputs,
                    num_beams=5,
                    max_new_tokens=50,
                    early_stopping=True,
                    no_repeat_ngram_size=2
                )
                caption = processor.decode(
                    output[0],
                    skip_special_tokens=True
                ).strip().capitalize()
            except Exception as exc:
                error = f"Failed to generate caption: {exc}"

    return render_template(
        "index.html",
        caption=caption,
        error=error,
        image_url=image_url
    )

if __name__ == "__main__":
    app.run(debug=True)