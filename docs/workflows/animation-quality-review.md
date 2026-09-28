# Animation quality review

## Purpose

Separate measurable faults, model suggestions, and human preference. Do not treat model confidence as quality or thumbs as training data.

## Workflow

1. **Create** — user edits layers, motion, duration, easing, and loop.
2. **Validate** — deterministic checks inspect the project: valid schema, finite values, valid targets, bounded transforms, export success, and loop continuity where a loop is requested. Return pass/fail and exact location; no grade yet.
3. **Review** — optional specialist AI reviewers inspect only their assigned signal (for example, composition screenshot, motion curve/metadata, or text legibility). Each returns `{criterion, grade, confidence, evidence}`. Review is advisory and disabled until a compatible non-LLM model is selected and evaluated.
4. **Aggregate** — a deterministic policy combines passed checks, reviewer grades, confidence, and human ratings. Missing/uncertain evidence yields “not enough evidence,” not a low grade. Never let a weighted average hide a failed hard check.
5. **Explain and decide** — show grade, criteria, evidence, and reason. User accepts, edits, or ignores. Applying any suggestion is an explicit user action.
6. **Learn from feedback** — store optional like/dislike plus project snapshot/version and rubric version locally. Use ratings to evaluate rubric/reviewer agreement offline; do not train or auto-change generation.

## Grade rubric

Use a 1–5 scale per criterion; no aggregate grade until criterion coverage and weights are defined.

| Criterion | Initial evidence |
|---|---|
| Function | Project validates; targets exist; preview/export works |
| Motion | Timing/easing are intentional; loop boundary is continuous when looped; no unintended jumps |
| Clarity | Main subject/action stays readable; text remains legible |
| Craft | Composition and motion fit selected style/purpose |
| Accessibility | Pause/stop is available for persistent motion; reduced-motion behavior works |

Return `grade: null` when evidence is absent. Each non-null grade includes a short reason and evidence reference. Aggregate policy must define criterion weights, hard failures, minimum reviewer confidence, and coverage threshold before implementation; keep these versioned and visible.

## Current project boundary

- Project currently has deterministic preview/export and local like/dislike feedback for artwork; feedback is not training data.
- Animation feedback in the image-animation UI is separate. Do not merge storage or rubrics until the data owners and snapshots are aligned.
- Laya resolver covers character proportions only and has no inference provider. It is not an animation quality rater.
- No quality grading, AI review, aggregation policy, or rating-based model update exists.

## Implementation order

1. Define rubric, grade meaning, and minimum evidence with human reviewers.
2. Add deterministic checks and a versioned review-result type.
3. Validate rubric against a small, human-rated animation set; record agreement and disagreements.
4. Evaluate optional task-specific reviewers against the same set. Keep only reviewers that improve agreement for their criterion.
5. Add transparent deterministic aggregation; missing data must not be imputed as failure.
6. Add review UI with evidence, grade explanation, and manual override.

No weights, cutoffs, or “AI decides pass” behavior should be shipped before calibration. Prefer a measured checklist first; a System 1 model may classify specific typed questions after its accuracy and confidence calibration are checked for that task.
