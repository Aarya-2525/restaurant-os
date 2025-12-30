# save as make_table_qr.py
import qrcode
from PIL import Image, ImageDraw, ImageFont

def make_table_qr(data, table_no,
                  qr_fill="#0a74ff", qr_back="white",
                  box_size=10, border=4,
                  label_font_path=None, label_font_size=36,
                  out_path="example_qr.png"):
    """
    data        : string to encode (URL or text)
    table_no    : integer or string to write as label
    qr_fill     : QR "dot" color (name or hex)
    qr_back     : QR background color
    box_size    : pixel size of each QR box (bigger -> bigger QR)
    border      : number of boxes for margin around QR
    label_font_path: path to .ttf font file or None to use default font
    label_font_size: font size for the label
    out_path    : output filename
    """

    # --- 1. make QR image ---
    qr = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # high correction
        box_size=box_size,
        border=border
    )
    qr.add_data(data)
    qr.make(fit=True)

    qr_img = qr.make_image(fill_color=qr_fill, back_color=qr_back).convert("RGB")

    # --- 2. prepare label (Table X) ---
    label = f"Table {table_no}"

    # Try to load a TTF font; fallback to default (smaller) if not found
    try:
        if label_font_path:
            font = ImageFont.truetype(label_font_path, label_font_size)
        else:
            # Common Windows font path example: "C:\\Windows\\Fonts\\arial.ttf"
            font = ImageFont.truetype("C:\\Users\\Aarya's Legion 5\\AppData\\Local\\Microsoft\\Windows\\Fonts\\InterDisplay-SemiBold.ttf", label_font_size)
    except Exception:
        font = ImageFont.load_default()
        print("Warning: Truetype font not found — using default font (size may differ).")

    # --- 3. create a new canvas with space for label below the QR ---
    qr_w, qr_h = qr_img.size
    padding_top = 10
    padding_bottom = 35
    space_for_label = label_font_size + 10  # rough space for the label

    canvas_w = qr_w
    canvas_h = qr_h + padding_top + space_for_label + padding_bottom

    # Use white background for label area to ensure good contrast; change if needed
    canvas = Image.new("RGB", (canvas_w, canvas_h), "white")
    canvas.paste(qr_img, (0, padding_top))

    # --- 4. draw label centered below the QR ---
    draw = ImageDraw.Draw(canvas)
    bbox = font.getbbox(label)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    text_x = (canvas_w - text_w) // 2
    text_y = padding_top + qr_h + ((space_for_label - text_h) // 2)

    # You can draw a light rounded rect behind the text for extra hierarchy (simplified as rectangle):
    rect_padding_x = 8
    rect_padding_y = 4
    rect_x0 = text_x - rect_padding_x
    rect_y0 = text_y - rect_padding_y
    rect_x1 = text_x + text_w + rect_padding_x
    rect_y1 = text_y + text_h + rect_padding_y

    # Draw subtle rectangle and text (change colors as desired)
    draw.rectangle([rect_x0, rect_y0, rect_x1, rect_y1], fill="white")
    draw.text((text_x, text_y), label, fill="#1a73e8", font=font)

    # --- 5. optional: add a small circular badge overlay at top-right corner of QR ---
    # Uncomment below if you want a badge instead of (or in addition to) the bottom label.

    # badge_radius = 28
    # badge_color = "#ff3b30"    # red badge
    # badge_text_color = "white"
    # badge_center = (qr_w - badge_radius - 8, padding_top + badge_radius + 8)
    # # circle
    # draw.ellipse([badge_center[0]-badge_radius, badge_center[1]-badge_radius,
    #               badge_center[0]+badge_radius, badge_center[1]+badge_radius],
    #              fill=badge_color)
    # # small number
    # badge_font = font  # or smaller font
    # bt_w, bt_h = draw.textsize(str(table_no), font=badge_font)
    # draw.text((badge_center[0] - bt_w//2, badge_center[1] - bt_h//2), str(table_no),
    #           fill=badge_text_color, font=badge_font)

    # --- 6. save file ---
    canvas.save(out_path)
    print(f"Saved: {out_path} (size: {canvas.size})")


if __name__ == "__main__":
    url = "https://www.example.com"
    make_table_qr(url, table_no=21,
                  qr_fill="#1a73e8",  # blue dots
                  qr_back="white",
                  box_size=8,
                  label_font_path=None,  # use arial or system default
                  label_font_size=32,
                  out_path=f"example_table_21_qr.png")
    print("Example QR code with label generated.")