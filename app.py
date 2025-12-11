
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torch
import torch.nn as nn
from torchvision import transforms
from Model import EfficientNetClassifier

app = Flask('myApp')
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024
CORS(app)

num_of_classes = 6
labels = ['Chickenpox', 'Cowpox', 'HFMD', 'Healthy', 'Measles', 'Monkeypox']

device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = EfficientNetClassifier(num_classes=num_of_classes, model_name="b3", pretrained=True).to(device)
model.load_state_dict(state_dict=torch.load(f="model_5(efficient_net_b3)with(Train accuracy_0.994_Test accuracy_0.893).pth", map_location=device))
model.to(device)


def get_prediction(model: nn.Module,
                   img_main,
                   transform,
                   device=device):
    """Makes a prediction and calculate probability on a target image with a trained model"""
    img = transform(img_main).to(device)
    model.eval()
    with torch.inference_mode():
        logit = model(img.unsqueeze(dim=0)).to(device)

    pred = labels[(torch.argmax(torch.softmax(logit, dim=1), dim=1)).cpu()]
    #pred = (torch.argmax(torch.softmax(logit, dim=1), dim=1)).cpu()
    prob = float(torch.softmax(logit, dim=1).max() *100)

    return pred, prob


@app.route('/prediction', methods=['POST'])
def APICall():
    file = request.files["file"]
    img = Image.open(file).convert("RGB")
    transform = transforms.Compose([transforms.Resize((224, 224)),
                                     transforms.ToTensor()
                                     ])

    pred, prob = get_prediction(model=model, img_main=img, transform=transform)
    return jsonify({"prediction": str(pred), "probability": round(prob, 2)})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5665, debug=False)
