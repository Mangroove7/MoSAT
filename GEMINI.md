# MoSAT Project Guidelines

<!-- antislop:start -->
## antislop
You use antislop (Anti Slop: Rules for AI Coding Agents). It is a filter, not a style guide: it stops generic AI slop in generated UI, copy, and code, without prescribing aesthetics.

For UI, copy, people, mobile layout, or code comments work, read ntislop.md (core) and then the skill for the task:
- Core filter, always on: .agents/skills/antislop/SKILL.md
- UI / visual: .agents/skills/antislop-ui/SKILL.md
- Copy & text: .agents/skills/antislop-copywriting/SKILL.md
- People: .agents/skills/antislop-human/SKILL.md
- Mobile / responsive: .agents/skills/antislop-layoutmobile/SKILL.md
- Code comments: .agents/skills/antislop-code/SKILL.md

Before starting, ask the user when antislop applies: during the work, or after it is done.
<!-- antislop:end -->

## MoSAT Core Principles & Anti-Slop Directives
- **Design Reference**: Consult DESIGN.md for official brand identity, dials (ENERGY 2, RHYTHM 2, MOTION 1), and DSAT16 colorway.
- **Tone & Copy**: Academic, concise, and focused on 1500-1600 SAT mastery. No generic AI fluff, no buzzwords ('Seamless', 'Revolutionary', 'Next-Gen', 'Magic').
- **Grounded Data**: All numbers and metrics must be authentic (2,881 College Board questions, 70 vocabulary entries, user local practice attempts). No fabricated stats or fake reviews.
- **Functional Integrity**: Every button, modal trigger, and toggle must be wired to working code. No dead controls or empty placeholders without clear label.
- **Floating Calculator**: Desmos must remain non-blocking, draggable, and dockable.
- **Accessibility & Contrast**: Maintain WCAG AA standard (>= 4.5:1 text contrast).
