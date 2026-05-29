"""
Extract droid thumbnails from DROIDEX in-game screenshots.

All 12 screenshots are 3840x2160 of the same static game UI.
Grid coordinates below are fixed constants measured from the screenshots.

  COL_LEFT / CELL_W  — derived from the rarity dot X positions
                        (dots are 50 px from each cell's left edge;
                         dot spacing = cell width = 284 px)
  ROW_YS             — Y centres of the rarity label rows, measured by
                        teal-pixel detection on default_page1.png

Run once: python scripts/extract_thumbnails.py
Debug:    python scripts/extract_thumbnails.py --debug
Output:   public/droids/{DROID_NAME}_{TIER}.png
"""

from PIL import Image
import os

# ─── Fixed grid layout (3840 x 2160) ─────────────────────────────────────────

COL_LEFT = 335   # x of the LEFT EDGE of the first column
# (rarity dots sit 50 px inside each cell at x=391,675,…)
CELL_W = 285   # cell width  = spacing between adjacent dot centres

# Y centre of each rarity label row (same on every page and every tier)
ROW_YS = [732, 1030, 1320, 1615]

COLS = 5

# ─── Crop insets (pixels) ─────────────────────────────────────────────────────
# Horizontal  — measured from cell edge (COL_LEFT + col*CELL_W)
LEFT_GAP = 45  # inset from the LEFT  edge of each cell
RIGHT_GAP = 45   # inset from the RIGHT edge of each cell

# Vertical — measured from the green label-centre circles (ROW_YS)
TOP_MARGIN = 80   # row 0 only: px from estimated cell top (clears tab bar)
ROW_GAP = 90   # rows 1+:    px below the PREVIOUS circle to start
LABEL_MARGIN = 30   # all rows:   px above the CURRENT  circle to stop

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
}

PAGES = {
    'DEFAULT': ['default_page1.png',  'default_page2.png',  'default_page3.png'],
    'GOLD':    ['gold_page1.png',     'gold_page2.png',     'gold_page3.png'],
    'DIAMOND': ['diamond_page1.png',  'diamond_page2.png',  'diamond_page3.png'],
    'RAINBOW': ['rainbow_page1.png',  'rainbow_page2.png',  'rainbow_page3.png'],
}

# ─── Cropping ─────────────────────────────────────────────────────────────────


def cell_bounds(row: int, col: int) -> tuple[int, int, int, int]:
    """
    Return (x0, y0, x1, y1) for one droid card.

    X: from the cell's left edge to its right edge, inset by PAD_X.
    Y top:
      row 0  -> ROW_YS[0] - row_spacing + TOP_MARGIN  (clears the tab bar)
      row 1+ -> ROW_YS[prev] + ROW_GAP               (past previous label)
    Y bottom: ROW_YS[row] - LABEL_MARGIN               (above label dots)
    """
    x0 = COL_LEFT + col * CELL_W + LEFT_GAP
    x1 = COL_LEFT + (col + 1) * CELL_W - RIGHT_GAP
    y1 = ROW_YS[row] - LABEL_MARGIN
    if row == 0:
        y0 = ROW_YS[0] - (ROW_YS[1] - ROW_YS[0]) + TOP_MARGIN
    else:
        y0 = ROW_YS[row - 1] + ROW_GAP
    return max(0, x0), max(0, y0), x1, y1


# ─── Main routines ────────────────────────────────────────────────────────────

def extract_all():
    os.makedirs('public/droids', exist_ok=True)
    total = 0

    for tier, page_files in PAGES.items():
        droids = DROIDS_BY_TIER[tier]
        droid_idx = 0

        for page_num, filename in enumerate(page_files):
            path = f'scripts/droidex_images/{filename}'
            if not os.path.exists(path):
                print(f'  SKIP: {path}')
                continue

            img = Image.open(path)
            remaining = len(droids) - droid_idx
            count = min(COLS * len(ROW_YS), remaining)

            for i in range(count):
                row, col = divmod(i, COLS)
                thumb = img.crop(cell_bounds(row, col))
                name = droids[droid_idx].replace(' ', '_')
                thumb.save(f'public/droids/{name}_{tier}.png')
                total += 1
                droid_idx += 1

            last = droids[droid_idx - 1] if droid_idx else '?'
            print(f'  {tier} p{page_num + 1}: {count} droids (to {last})')

    print(f'\nDone -- {total} thumbnails -> public/droids/')


def debug_overlay():
    """Draw crop boxes on default_page1.png and save a 1920x1080 overlay."""
    from PIL import ImageDraw

    img = Image.open('scripts/droidex_images/default_page1.png').copy()
    draw = ImageDraw.Draw(img)

    for row in range(len(ROW_YS)):
        for col in range(COLS):
            draw.rectangle(list(cell_bounds(row, col)),
                           outline=(255, 0, 0), width=8)
        # green dot marking each detected label Y centre
        y = ROW_YS[row]
        for col in range(COLS):
            cx = COL_LEFT + col * CELL_W + CELL_W // 2
            draw.ellipse([cx - 18, y - 18, cx + 18, y + 18],
                         outline=(0, 255, 0), width=4)

    os.makedirs('scripts/debug_crops', exist_ok=True)

    img.resize((1920, 1080)).save('scripts/debug_crops/grid_overlay.png')
    print('Overlay saved -> scripts/debug_crops/grid_overlay.png')
    print(f'COL_LEFT={COL_LEFT}  CELL_W={CELL_W}  ROW_YS={ROW_YS}')


if __name__ == '__main__':
    import sys
    if '--debug' in sys.argv:
        debug_overlay()
    else:
        extract_all()
