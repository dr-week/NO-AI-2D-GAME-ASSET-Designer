# UI-07 · Landscape templates

Status: Implemented. Categorized style selector, optional review-first local Laya suggestion, and compact local recipe manager.

## Controls

Landform, composition, environment, time of day, art style, color mood, material, seed; Random scene; Vary
(seed only); SVG export; Name + Save current scene; Load; Delete with confirmation; JSON backup.

## Flow

Choose landform, composition, environment, and light → choose an art style or review an optional local Laya suggestion → adjust color mood/material → preview → vary the seed or randomize the scene → save recipe or transfer a validated JSON backup. Manual controls remain available offline.

## States

Empty library, saved recipes tagged by environment/style, loading/error status, import/export success or error. Preserve landform, composition, environment, lighting, style ID, color mood, material, and seed on load.
