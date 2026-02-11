
import os
import urllib.request
from PIL import Image, ImageDraw, ImageFont

# 1. Font Download (Nano Gothic or similar for Korean)
font_url = "https://github.com/google/fonts/raw/main/ofl/nanumgothic/NanumGothic-Bold.ttf"
font_path = "NanumGothic-Bold.ttf"

if not os.path.exists(font_path):
    print("Downloading font...")
    try:
        urllib.request.urlretrieve(font_url, font_path)
    except Exception as e:
        print(f"Font download failed: {e}")
        # Use default font if download fails
        pass

# 2. Setup Image
size = (128, 128)
bg_color = (0, 0, 0, 0) # Transparent background
shield_color = (20, 30, 60) # Dark Navy
text_color = (255, 255, 255) # White

img = Image.new("RGBA", size, bg_color)
draw = ImageDraw.Draw(img)

# 3. Draw Shield
# Simple shield shape coordinates
# Top-left, Top-right, Bottom-point
coords = [
    (10, 10),   # Top-left
    (118, 10),  # Top-right
    (118, 50),  # Side-right
    (64, 118),  # Bottom tip
    (10, 50)    # Side-left
]
# Draw a polygon for the shield
draw.polygon(coords, fill=shield_color, outline=(0, 255, 65), width=2) # Neon green border for extra style

# 4. Draw Text "SOS"
try:
    font_sos = ImageFont.truetype(font_path, 48)
    font_kr = ImageFont.truetype(font_path, 16)
except:
    font_sos = ImageFont.load_default()
    font_kr = ImageFont.load_default()

draw.text((64, 50), "SOS", fill=text_color, font=font_sos, anchor="mm")

# 5. Draw Text "남편응급실"
draw.text((64, 85), "남편응급실", fill=text_color, font=font_kr, anchor="mm")

# 6. Save
output_path = "public/icon-128.png"
img.save(output_path)
print(f"Icon saved to {output_path}")
