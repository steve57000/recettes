#!/usr/bin/env python3
"""Generate Maison Saison PNG/ICO social and app assets.

This script intentionally uses only Python's standard library so the binary files can
be generated locally and uploaded manually, without adding them to pull requests.
"""
from __future__ import annotations

import argparse
import binascii
import math
import struct
import zlib
from pathlib import Path

Color = tuple[int, int, int, int]

CREAM = (255, 248, 237, 255)
WHITE = (255, 255, 255, 255)
ORANGE = (240, 90, 55, 255)
AMBER = (255, 214, 102, 255)
GREEN = (47, 158, 68, 255)
RED = (222, 60, 66, 255)
DARK = (36, 20, 13, 255)
SOFT = (123, 98, 83, 255)
SHADOW = (69, 35, 16, 55)

FONT = {
    " ": ["000", "000", "000", "000", "000", "000", "000"],
    "A": ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    "C": ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
    "D": ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
    "E": ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
    "G": ["01111", "10000", "10000", "10011", "10001", "10001", "01110"],
    "I": ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
    "M": ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
    "N": ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
    "O": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
    "R": ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
    "S": ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    "T": ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
    "U": ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
}


def rgba(color: Color, alpha: int | None = None) -> Color:
    return color[:3] + ((color[3] if alpha is None else alpha),)


class Canvas:
    def __init__(self, width: int, height: int, background: Color = CREAM) -> None:
        self.width = width
        self.height = height
        self.pixels = [background] * (width * height)

    def _blend(self, x: int, y: int, color: Color) -> None:
        if not (0 <= x < self.width and 0 <= y < self.height):
            return
        r, g, b, a = color
        br, bg, bb, ba = self.pixels[y * self.width + x]
        opacity = a / 255
        background_opacity = ba / 255
        output_alpha = opacity + background_opacity * (1 - opacity)
        if output_alpha == 0:
            self.pixels[y * self.width + x] = (0, 0, 0, 0)
            return
        self.pixels[y * self.width + x] = (
            int((r * opacity + br * background_opacity * (1 - opacity)) / output_alpha),
            int((g * opacity + bg * background_opacity * (1 - opacity)) / output_alpha),
            int((b * opacity + bb * background_opacity * (1 - opacity)) / output_alpha),
            int(output_alpha * 255),
        )

    def gradient(self, start: tuple[int, int, int], end: tuple[int, int, int]) -> None:
        for y in range(self.height):
            for x in range(self.width):
                t = (x / self.width * 0.62) + (y / self.height * 0.38)
                self.pixels[y * self.width + x] = (
                    int(start[0] * (1 - t) + end[0] * t),
                    int(start[1] * (1 - t) + end[1] * t),
                    int(start[2] * (1 - t) + end[2] * t),
                    255,
                )

    def rect(self, x0: int, y0: int, x1: int, y1: int, color: Color) -> None:
        for y in range(max(0, y0), min(self.height, y1)):
            for x in range(max(0, x0), min(self.width, x1)):
                self._blend(x, y, color)

    def rounded_rect(self, x0: int, y0: int, x1: int, y1: int, radius: int, color: Color) -> None:
        for y in range(max(0, y0), min(self.height, y1)):
            for x in range(max(0, x0), min(self.width, x1)):
                dx = max(x0 + radius - x, 0, x - (x1 - radius - 1))
                dy = max(y0 + radius - y, 0, y - (y1 - radius - 1))
                if dx * dx + dy * dy <= radius * radius:
                    self._blend(x, y, color)

    def circle(self, cx: int, cy: int, radius: int, color: Color) -> None:
        radius_squared = radius * radius
        for y in range(max(0, cy - radius), min(self.height, cy + radius + 1)):
            for x in range(max(0, cx - radius), min(self.width, cx + radius + 1)):
                if (x - cx) ** 2 + (y - cy) ** 2 <= radius_squared:
                    self._blend(x, y, color)

    def ring(self, cx: int, cy: int, radius: int, thickness: int, color: Color) -> None:
        outer = radius * radius
        inner = (radius - thickness) * (radius - thickness)
        for y in range(max(0, cy - radius), min(self.height, cy + radius + 1)):
            for x in range(max(0, cx - radius), min(self.width, cx + radius + 1)):
                distance = (x - cx) ** 2 + (y - cy) ** 2
                if inner <= distance <= outer:
                    self._blend(x, y, color)

    def line(self, x0: int, y0: int, x1: int, y1: int, width: int, color: Color) -> None:
        vx = x1 - x0
        vy = y1 - y0
        length_squared = vx * vx + vy * vy or 1
        for y in range(max(0, min(y0, y1) - width), min(self.height, max(y0, y1) + width + 1)):
            for x in range(max(0, min(x0, x1) - width), min(self.width, max(x0, x1) + width + 1)):
                t = max(0, min(1, ((x - x0) * vx + (y - y0) * vy) / length_squared))
                px = x0 + t * vx
                py = y0 + t * vy
                if (x - px) ** 2 + (y - py) ** 2 <= (width / 2) ** 2:
                    self._blend(x, y, color)


def save_png(path: Path, canvas: Canvas) -> None:
    scanlines = []
    for y in range(canvas.height):
        row = canvas.pixels[y * canvas.width : (y + 1) * canvas.width]
        scanlines.append(b"\x00" + bytes(channel for pixel in row for channel in pixel))
    raw = b"".join(scanlines)

    def chunk(kind: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", binascii.crc32(kind + data) & 0xFFFFFFFF)

    path.write_bytes(
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", canvas.width, canvas.height, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )


def draw_text(canvas: Canvas, text: str, x: int, y: int, scale: int, color: Color) -> None:
    cursor = x
    for char in text.upper().replace("É", "E").replace("È", "E"):
        glyph = FONT.get(char, FONT[" "])
        for gy, row in enumerate(glyph):
            for gx, value in enumerate(row):
                if value == "1":
                    canvas.rect(cursor + gx * scale, y + gy * scale, cursor + (gx + 1) * scale, y + (gy + 1) * scale, color)
        cursor += (len(glyph[0]) + 1) * scale


def draw_logo(canvas: Canvas, cx: int, cy: int, size: int) -> None:
    canvas.circle(cx + size // 20, cy + size // 12, int(size * 0.43), SHADOW)
    canvas.circle(cx, cy, int(size * 0.42), rgba(WHITE, 246))
    canvas.ring(cx, cy, int(size * 0.42), max(2, int(size * 0.045)), ORANGE)
    canvas.circle(cx, cy, int(size * 0.28), (255, 242, 219, 255))
    canvas.circle(cx - int(size * 0.09), cy - int(size * 0.02), int(size * 0.10), rgba(GREEN, 238))
    canvas.circle(cx + int(size * 0.08), cy + int(size * 0.04), int(size * 0.11), rgba(RED, 245))
    canvas.circle(cx + int(size * 0.13), cy - int(size * 0.08), int(size * 0.09), rgba(AMBER, 245))
    canvas.line(cx - int(size * 0.23), cy + int(size * 0.19), cx + int(size * 0.22), cy - int(size * 0.18), max(4, int(size * 0.035)), rgba(ORANGE, 245))
    canvas.line(cx - int(size * 0.28), cy - int(size * 0.26), cx - int(size * 0.28), cy + int(size * 0.29), max(3, int(size * 0.025)), rgba(DARK, 230))


def make_icon(size: int, path: Path) -> None:
    canvas = Canvas(size, size, (0, 0, 0, 0))
    canvas.rounded_rect(0, 0, size, size, int(size * 0.22), CREAM)
    canvas.circle(int(size * 0.18), int(size * 0.16), int(size * 0.30), rgba(AMBER, 80))
    canvas.circle(int(size * 0.88), int(size * 0.20), int(size * 0.28), rgba(ORANGE, 55))
    canvas.circle(int(size * 0.76), int(size * 0.86), int(size * 0.30), rgba(GREEN, 45))
    draw_logo(canvas, size // 2, size // 2, int(size * 0.78))
    save_png(path, canvas)


def make_social_card(path: Path) -> None:
    canvas = Canvas(1200, 630)
    canvas.gradient((255, 248, 237), (255, 230, 201))
    canvas.circle(170, 105, 250, rgba(AMBER, 92))
    canvas.circle(1030, 115, 230, rgba(ORANGE, 58))
    canvas.circle(945, 560, 260, rgba(GREEN, 50))
    canvas.rounded_rect(72, 72, 1128, 558, 46, rgba(WHITE, 205))
    canvas.rounded_rect(92, 92, 1108, 538, 34, (255, 248, 237, 130))
    draw_logo(canvas, 285, 315, 300)
    draw_text(canvas, "MAISON SAISON", 500, 176, 18, DARK)
    draw_text(canvas, "CARNET DE RECETTES", 505, 320, 9, ORANGE)
    draw_text(canvas, "ETE GOURMAND", 505, 410, 11, SOFT)
    canvas.circle(1000, 430, 44, rgba(RED, 210))
    canvas.circle(1060, 480, 34, rgba(AMBER, 220))
    canvas.circle(930, 500, 42, rgba(GREEN, 180))
    canvas.line(935, 155, 1075, 250, 13, rgba(ORANGE, 160))
    canvas.line(995, 125, 890, 255, 10, rgba(GREEN, 150))
    save_png(path, canvas)


def make_ico(path: Path, png_16: Path, png_32: Path) -> None:
    images = [(16, png_16.read_bytes()), (32, png_32.read_bytes())]
    header = struct.pack("<HHH", 0, 1, len(images))
    offset = 6 + 16 * len(images)
    entries = b""
    body = b""
    for size, data in images:
        entries += struct.pack("<BBBBHHII", size, size, 0, 0, 1, 32, len(data), offset)
        body += data
        offset += len(data)
    path.write_bytes(header + entries + body)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Maison Saison social preview and app icon assets.")
    parser.add_argument("--output", default="assets", help="Output directory for generated PNG/ICO assets.")
    args = parser.parse_args()
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)

    for size, filename in [
        (180, "apple-touch-icon.png"),
        (192, "icon-192.png"),
        (512, "icon-512.png"),
        (32, "favicon-32x32.png"),
        (16, "favicon-16x16.png"),
    ]:
        make_icon(size, output / filename)
    make_social_card(output / "social-card.png")
    make_ico(output / "favicon.ico", output / "favicon-16x16.png", output / "favicon-32x32.png")
    print(f"Generated Maison Saison assets in {output.resolve()}")


if __name__ == "__main__":
    main()
