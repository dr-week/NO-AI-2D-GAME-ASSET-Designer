# UI-05 · Project

Status: partial. The image-animation workspace supports project JSON save/open,
browser save/restore, and animated SVG export. Automatic autosave, character projects,
PNG export, and frame sequences remain planned.

## Purpose
Preserve editable work and export transparent artwork.

## Controls
Open/save project JSON, save/restore one project in browser storage, export animated SVG.
Automatic autosave, character projects, PNG, and PNG sequences are planned.

## Flow
Create/import image layers → download project JSON and optionally save in browser storage
→ restore from browser or open JSON → export animated SVG.

## States
Saving, saved, local project available, invalid file, storage full, export failure. Validate
project before replacing work. Keep current work after errors.
Browser storage is size-limited; downloaded JSON is the durable copy. SVG export excludes
editor guides. Moving a cutout can leave the original visible unless the source has a clean plate.
