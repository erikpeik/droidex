"""
Extract droid thumbnails from DROIDEX in-game screenshots.

Screenshots are 3840x2160 of the same static game UI. The grid layout
can shift slightly between tiers / game versions / platforms, so this
script auto-detects card borders per image rather than relying on fixed
pixel coordinates.

Run once:  python scripts/extract_thumbnails.py
Debug:     python scripts/extract_thumbnails.py --debug
Debug all: python scripts/extract_thumbnails.py --debug-all
Output:    public/droids/{DROID_NAME}_{TIER}.png
"""

from PIL import Image
import os

# ─── Detection parameters ─────────────────────────────────────────────────────

# Brightness threshold to distinguish card border from black background.
# A pixel is considered "border" if (R + G + B) > BORDER_THRESHOLD.
BORDER_THRESHOLD = 100

# Thickness of the card border frame (px at 3840x2160).
# After detecting the outer border edge, we inset by this amount to reach content.
BORDER_WIDTH = 8

# ─── Uniform output crop size ─────────────────────────────────────────────────

CROP_W = 195   # uniform thumbnail width  (px, cropped from source resolution)
CROP_H = 195   # uniform thumbnail height (px, cropped from source resolution)

# Height of the rarity label text at the bottom of each card (px).
# The crop is shifted up by this amount to exclude the label from thumbnails.
LABEL_HEIGHT = 34

# ─── Grid constants ───────────────────────────────────────────────────────────

COLS = 5
ROWS = 4

# ─── Droid manifest ───────────────────────────────────────────────────────────

ALL_DROIDS = [
    # Common (11)
    'MOUSE', 'PIT', 'GONK', 'CB', 'R3',
    'R5', 'R8', 'IMPERIAL PROBE', 'B1 BATTLE', 'DRK-1 PROBE', 'ID10',
    # Rare (14)
    'BDX EXPLORER', 'ARG', 'SENATE HOVERCAM', 'BU-4D',
    'BAL-CORE', 'ROLL-R', '2BB', 'A-LT', 'R4',
    'R9', 'B1 SECURITY', 'NAV-EX', 'VECT-ARM', 'HOV-R',
    # Epic (18)
    'GROUNDMECH', 'LO', 'AMP WALKER', 'SEN-TRI', 'OPTI-POD',
    'GUNRUNNER', 'BB', 'R2', 'R6', 'TRAK-R', 'ORB-WALKER',
    'UTIL-TEC', 'B1 HEAVY', 'B2 SUPER', 'B2 HEAVY', 'STRIKE-ORB',
    'HAUL-R', 'LNG-SHOT',
    # Legendary (8)
    'PROTO-ROLLER', 'MECHA-DROID', 'MONO-WALKER', 'BB9', 'R7',
    'B2-RP', 'CYCLO-GRAV', 'OPTI-STRIKE',
    # Mythic (3) — DEFAULT tier only
    'BB8', 'MISTER BONES', 'IG-11 MARSHAL',
]

DROIDS_BY_TIER = {
    'DEFAULT': ALL_DROIDS,       # 54
    'GOLD':    ALL_DROIDS[:51],  # 51
    'DIAMOND': ALL_DROIDS[:51],  # 51
    'RAINBOW': ALL_DROIDS[:51],  # 51
    'BESKAR': ALL_DROIDS[:51],  # 51
}

PAGES = {
    'DEFAULT': ['default_page1.png',  'default_page2.png',  'default_page3.png'],
    'GOLD':    ['gold_page1.png',     'gold_page2.png',     'gold_page3.png'],
    'DIAMOND': ['diamond_page1.png',  'diamond_page2.png',  'diamond_page3.png'],
    'RAINBOW': ['rainbow_page1.png',  'rainbow_page2.png',  'rainbow_page3.png'],
    'BESKAR': ['beskar_page1.png',  'beskar_page2.png',  'beskar_page3.png'],
}

# ─── Cropping ─────────────────────────────────────────────────────────────────


def _brightness(img, x, y):
    """Return sum of RGB channels for a pixel."""
    px = img.getpixel((x, y))
    if isinstance(px, (tuple, list)):
        return sum(px[:3])
    return px * 3  # grayscale


def _is_bright(img, x, y):
    """True if pixel brightness exceeds threshold."""
    return _brightness(img, x, y) > BORDER_THRESHOLD


def _find_top_border_y(img):
    """
    Find the Y coordinate of the top border of row 0 by scanning downward
    from below the tab bar area. Uses multiple X positions in the expected
    grid area and returns the most consistent (lowest) top border Y.
    """
    w, h = img.size
    # Scan at several X positions spread across the expected grid width
    # The grid occupies roughly the left 40% of the image (x: 300-1600 at 3840w)
    scan_positions = [w // 10, w * 2 // 10, w * 3 // 10]
    top_ys = []

    for sx in scan_positions:
        # Start from y=500 (safely below tab bar at ~400-480)
        for y in range(500, 800):
            if _is_bright(img, sx, y):
                top_ys.append(y)
                break

    if not top_ys:
        return None
    # Return the most common / median Y (handles outliers)
    top_ys.sort()
    return top_ys[len(top_ys) // 2]


def _detect_columns(img, border_y):
    """
    Detect column positions by scanning horizontally at the top border Y.
    Returns list of (left_x, right_x) for each detected column (outer border edges).
    """
    w = img.size[0]
    # Scan the left ~55% of the image where the grid lives
    # (BESKAR's 5th column can extend up to ~50% of image width)
    scan_end = int(w * 0.55)

    columns = []  # list of (start_x, end_x)
    in_border = False
    start_x = 0

    for x in range(0, scan_end):
        bright = _is_bright(img, x, border_y)
        if bright and not in_border:
            start_x = x
            in_border = True
        elif not bright and in_border:
            width = x - start_x
            # Card borders are ~200-240px wide at top; ignore narrow artifacts (<100px)
            if width > 100:
                columns.append((start_x, x - 1))
            in_border = False

    # Handle case where last column extends to scan_end
    if in_border:
        width = scan_end - start_x
        if width > 100:
            columns.append((start_x, scan_end - 1))

    return columns


def _detect_rows(img, scan_x, num_rows_needed):
    """
    Detect row positions by scanning vertically at the center of a column.
    Returns list of (top_y, bottom_y) for each detected row (outer border edges).

    Rows are separated by gaps (black regions between the bottom border of one
    row and the top border of the next).
    """
    h = img.size[1]
    # Scan from just above the first expected card to below the last
    scan_start = 500   # safely below tab bar
    scan_end = min(h, 1700)  # safely above the bottom UI buttons

    rows = []
    in_border = False
    start_y = 0

    for y in range(scan_start, scan_end):
        bright = _is_bright(img, scan_x, y)
        if bright and not in_border:
            start_y = y
            in_border = True
        elif not bright and in_border:
            height = y - start_y
            # Card cells are ~200-260px tall; ignore narrow artifacts (<50px)
            if height > 50:
                rows.append((start_y, y - 1))
                if len(rows) >= num_rows_needed:
                    break
            in_border = False

    # Handle case where last row extends to scan_end
    if in_border and len(rows) < num_rows_needed:
        height = scan_end - start_y
        if height > 50:
            rows.append((start_y, scan_end - 1))

    return rows


def detect_grid(img, num_cells=20):
    """
    Auto-detect the 5×4 grid of card cells in an image.

    Strategy:
    1. Find the top border Y by scanning downward from below the tab bar.
    2. Detect columns by scanning horizontally at the top border Y (clean border line).
    3. Detect rows by scanning vertically at the center of the first column.

    num_cells: how many cells are actually populated (row-major order).
    Returns (cells, col_edges, row_edges):
      - cells: list of 20 (x0, y0, x1, y1) content areas or None if detection failed
      - col_edges: list of (left_x, right_x) per column
      - row_edges: list of (top_y, bottom_y) per row
    """
    num_rows_needed = min(ROWS, (num_cells + COLS - 1) // COLS)

    # Step 1: Find the top border Y
    border_y = _find_top_border_y(img)
    if border_y is None:
        # Complete detection failure
        return [None] * (COLS * ROWS), [(None, None)] * COLS, [(None, None)] * ROWS

    # Step 2: Detect columns from the top border line
    col_edges = _detect_columns(img, border_y)

    # Pad/trim to exactly COLS columns
    while len(col_edges) < COLS:
        col_edges.append((None, None))
    col_edges = col_edges[:COLS]

    # Step 3: Detect rows using vertical scan through the LEFT BORDER of
    # the first valid column (the border line is clean and continuous,
    # unlike the card center which has noisy droid image content).
    scan_x = None
    for cl, cr in col_edges:
        if cl is not None and cr is not None:
            scan_x = cl + BORDER_WIDTH // 2  # middle of the left border
            break

    if scan_x is None:
        return [None] * (COLS * ROWS), col_edges, [(None, None)] * ROWS

    row_edges = _detect_rows(img, scan_x, num_rows_needed)

    # Pad to ROWS
    while len(row_edges) < ROWS:
        row_edges.append((None, None))

    # --- Build cell content areas ---
    cells = []
    for row in range(ROWS):
        for col in range(COLS):
            cl_cr = col_edges[col] if col < len(col_edges) else (None, None)
            rt_rb = row_edges[row] if row < len(row_edges) else (None, None)
            cl, cr = cl_cr
            rt, rb = rt_rb

            if any(v is None for v in (cl, cr, rt, rb)):
                cells.append(None)
                continue

            # Inset by border width to get content area
            x0 = cl + BORDER_WIDTH
            x1 = cr - BORDER_WIDTH
            y0 = rt + BORDER_WIDTH
            y1 = rb - BORDER_WIDTH

            cells.append((x0, y0, x1, y1))

    return cells, col_edges, row_edges


def crop_centered(img, content_box):
    """
    Crop a uniform CROP_W × CROP_H region centered within the content_box,
    shifted upward to exclude the rarity label text at the bottom.
    """
    x0, y0, x1, y1 = content_box
    content_w = x1 - x0

    # Exclude the label area from the effective content height
    effective_y1 = y1 - LABEL_HEIGHT
    content_h = effective_y1 - y0

    # Center the crop horizontally
    if content_w >= CROP_W:
        cx = (x0 + x1) // 2
        crop_x0 = cx - CROP_W // 2
        crop_x1 = crop_x0 + CROP_W
    else:
        crop_x0 = x0
        crop_x1 = x1

    # Center the crop vertically within the label-excluded area
    if content_h >= CROP_H:
        cy = (y0 + effective_y1) // 2
        crop_y0 = cy - CROP_H // 2
        crop_y1 = crop_y0 + CROP_H
    else:
        crop_y0 = y0
        crop_y1 = y0 + min(content_h, CROP_H)

    return img.crop((crop_x0, crop_y0, crop_x1, crop_y1))


# ─── Main routines ────────────────────────────────────────────────────────────

def extract_all(tier=None):
    os.makedirs('public/droids', exist_ok=True)
    total = 0
    warnings = 0

    pages = {tier: PAGES[tier]} if tier else PAGES

    for t, page_files in pages.items():
        droids = DROIDS_BY_TIER[t]
        droid_idx = 0

        for page_num, filename in enumerate(page_files):
            path = f'scripts/droidex_images/{filename}'
            if not os.path.exists(path):
                print(f'  SKIP: {path}')
                continue

            img = Image.open(path)
            remaining = len(droids) - droid_idx
            count = min(COLS * ROWS, remaining)

            # Auto-detect grid for this image
            cells, _, _ = detect_grid(img, num_cells=count)

            for i in range(count):
                row, col = divmod(i, COLS)
                cell_idx = row * COLS + col

                if cells[cell_idx] is not None:
                    thumb = crop_centered(img, cells[cell_idx])
                else:
                    warnings += 1
                    print(
                        f'    WARN: detection failed for {t} p{page_num+1} [{row},{col}], skipping')
                    droid_idx += 1
                    continue

                name = droids[droid_idx].replace(' ', '_')
                thumb.save(f'public/droids/{name}_{t}.png')
                total += 1
                droid_idx += 1

            last = droids[droid_idx - 1] if droid_idx else '?'
            print(f'  {t} p{page_num + 1}: {count} droids (to {last})')

    print(f'\nDone -- {total} thumbnails -> public/droids/')
    if warnings:
        print(f'  WARNING: {warnings} cells failed detection and were skipped')


def debug_overlay(tier='DEFAULT', page=None):
    """
    Draw detection results on screenshot(s) and save full-res overlay.

    Blue  = detected border bounds (outer edge of card frame)
    Red   = final crop region (what gets extracted)
    Green = detected content area center
    """
    from PIL import ImageDraw

    os.makedirs('scripts/debug_crops', exist_ok=True)
    page_files = PAGES[tier]
    if page is not None:
        page_files = [page_files[page]]

    for page_num, filename in enumerate(page_files):
        path = f'scripts/droidex_images/{filename}'
        if not os.path.exists(path):
            print(f'  SKIP: {path}')
            continue

        img = Image.open(path).copy()
        draw = ImageDraw.Draw(img)

        cells, col_edges, row_edges = detect_grid(img)

        # Draw blue rectangles for detected border bounds
        for row in range(ROWS):
            for col in range(COLS):
                cl, cr = col_edges[col]
                rt, rb = row_edges[row]
                if all(v is not None for v in (cl, cr, rt, rb)):
                    draw.rectangle([cl, rt, cr, rb],
                                   outline=(0, 100, 255), width=6)

        # Draw red rectangles for final crop regions + green center dots
        for row in range(ROWS):
            for col in range(COLS):
                cell_idx = row * COLS + col
                cell = cells[cell_idx]
                if cell is None:
                    continue

                x0, y0, x1, y1 = cell
                content_w = x1 - x0

                # Exclude label area (same logic as crop_centered)
                effective_y1 = y1 - LABEL_HEIGHT
                content_h = effective_y1 - y0

                # Compute crop region (same logic as crop_centered)
                if content_w >= CROP_W:
                    cx = (x0 + x1) // 2
                    crop_x0 = cx - CROP_W // 2
                    crop_x1 = crop_x0 + CROP_W
                else:
                    crop_x0, crop_x1 = x0, x1

                if content_h >= CROP_H:
                    cy = (y0 + effective_y1) // 2
                    crop_y0 = cy - CROP_H // 2
                    crop_y1 = crop_y0 + CROP_H
                else:
                    crop_y0 = y0
                    crop_y1 = y0 + min(content_h, CROP_H)

                draw.rectangle([crop_x0, crop_y0, crop_x1, crop_y1],
                               outline=(255, 0, 0), width=4)

                # Green center dot
                gcx = (crop_x0 + crop_x1) // 2
                gcy = (crop_y0 + crop_y1) // 2
                draw.ellipse([gcx - 10, gcy - 10, gcx + 10, gcy + 10],
                             fill=(0, 255, 0))

        out = f'scripts/debug_crops/grid_overlay_{tier.lower()}_p{page_num + 1}.png'
        img.save(out)
        print(
            f'Overlay saved -> {out}  (full res {img.size[0]}x{img.size[1]})')


def debug_all():
    """Generate debug overlays for all tiers and all pages."""
    for tier in PAGES:
        print(f'\n--- {tier} ---')
        debug_overlay(tier=tier)


if __name__ == '__main__':
    import sys
    tier = None
    if '--tier' in sys.argv:
        idx = sys.argv.index('--tier')
        tier = sys.argv[idx + 1].upper()
    if '--debug-all' in sys.argv:
        debug_all()
    elif '--debug' in sys.argv:
        debug_overlay(tier=tier or 'DEFAULT')
    else:
        extract_all(tier=tier)
