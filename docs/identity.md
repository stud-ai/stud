# `packages/identity` — Brand Assets

The identity package contains Stud's brand assets, including logos, marks, and icons.

## Overview

- **Package name**: `@stud/identity`
- **Contents**: SVG and PNG brand assets

## Files

| File | Description |
|------|-------------|
| `mark.svg` | Geometric "S" mark logo — clean, minimal, used for small contexts |

## App Icon

The primary app icon (pixel-art durian) lives in the desktop package at:

```
packages/desktop/src-tauri/icons/
├── icon.png        # Full-size app icon
├── 32x32.png       # Small icon
├── 128x128.png     # Medium icon
├── 128x128@2x.png  # Retina medium icon
├── icon.icns       # macOS icon bundle
└── icon.ico        # Windows icon
```

## Usage

The geometric mark is used for brand identity, while the pixel-art durian icon is the actual application icon displayed in:

- The macOS dock
- The Windows taskbar
- The Linux application menu
- The README header
