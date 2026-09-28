# Documentation map

Use one authoritative home for each kind of project information. Link to that home
instead of copying details into another document.

| Information | Source of truth | Update when |
|---|---|---|
| Product scope and acceptance behavior | [Requirements](requirements.md) | User-visible scope or acceptance criteria change. |
| Settled architecture and code ownership | [Design](design.md) | A boundary, data flow, or module responsibility changes. |
| Current implementation snapshot | [Status](status.md) | A module's delivered or remaining capabilities change. |
| Unresolved risks and questions | [Issues](issues.md) | New evidence reveals a defect, risk, or unanswered question. |
| Prioritized future work | [Task queue](tasks/README.md) | Work is agreed and ready to be prioritized. |
| Ownership, files, checks, and completed work | [Contribution log](contributions/README.md) | A task starts, changes scope, or completes. Check active ownership before editing. |
| Technology decisions and adoption triggers | [Technology register](roadmap/technology-register.md) | A technology is implemented, deferred, or has a new adoption trigger. |
| UI behavior and workspace controls | [UI/UX guides](ui-ux/README.md) | A workspace interaction, control, or navigation pattern changes. |
| Repeatable operating procedures | [Workflows](workflows/) | A process needs durable, step-by-step guidance. |
| Background research | [`research/`](../research/) | Evidence or comparisons are collected; promote decisions to Design or the technology register. |

## Keep records aligned

Follow [Contributing](contributing.md) for the change workflow. For behavior changes,
update requirements or the relevant UI guide, then update the implementation snapshot.
Record open questions in Issues, agreed future work in the Task queue, and actual file
ownership, checks, and outcomes in the Contribution log. Keep status and issue records
brief; put detailed rationale in Design or linked research.
