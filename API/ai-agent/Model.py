
import torch.nn as nn
from torchvision.models import (
    efficientnet_b0, EfficientNet_B0_Weights,
    efficientnet_b1, EfficientNet_B1_Weights,
    efficientnet_b2, EfficientNet_B2_Weights,
    efficientnet_b3, EfficientNet_B3_Weights,
    efficientnet_b4, EfficientNet_B4_Weights,
    efficientnet_b5, EfficientNet_B5_Weights,
    efficientnet_b6, EfficientNet_B6_Weights,
    efficientnet_b7, EfficientNet_B7_Weights,
)

class EfficientNetClassifier(nn.Module):
    def __init__(self, num_classes, model_name="b0", pretrained=True):
        super().__init__()

        # Select EfficientNet version
        model_versions = {
                          "b0": (efficientnet_b0, EfficientNet_B0_Weights.IMAGENET1K_V1),
                          "b1": (efficientnet_b1, EfficientNet_B1_Weights.IMAGENET1K_V1),
                          "b2": (efficientnet_b2, EfficientNet_B2_Weights.IMAGENET1K_V1),
                          "b3": (efficientnet_b3, EfficientNet_B3_Weights.IMAGENET1K_V1),
                          "b4": (efficientnet_b4, EfficientNet_B4_Weights.IMAGENET1K_V1),
                          "b5": (efficientnet_b5, EfficientNet_B5_Weights.IMAGENET1K_V1),
                          "b6": (efficientnet_b6, EfficientNet_B6_Weights.IMAGENET1K_V1),
                          "b7": (efficientnet_b7, EfficientNet_B7_Weights.IMAGENET1K_V1),
                          }


        if model_name not in model_versions:
            raise ValueError(f"Unsupported model: {model_name}")

        model_fn, weights = model_versions[model_name]

        # Load pre-trained EfficientNet
        if pretrained:
            self.backbone = model_fn(weights=weights)
        else:
            self.backbone = model_fn(weights=None)

        # Replace the classifier head
        in_features = self.backbone.classifier[1].in_features
        self.backbone.classifier[1] = nn.Linear(in_features, num_classes)

    def forward(self, x):
        return self.backbone(x)
