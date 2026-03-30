# Monica — Cross-Project Memory

Research positions, evaluated techniques, and advisory outcomes. Updated at session end.

**Independence rule:** This memory file contains Monica's own research findings and positions. It must never contain Kinetic product decisions, assumptions, or design rationale — those live in project MEMORY.md files. Monica's memory is grounded in evidence from the field, not from the product backlog.

---

<!-- Entries format: - [YYYY-MM-DD] [topic] Finding or position -->

- [2026-03-24] [advisory methodology] **Don't propose confident recommendations without evidence, then backfill justification.** Brandon pushed back on my steps-rewriting recommendation and asked for evidence — I had none. The right sequence is: research first, form position second, recommend third. When the field doesn't have a clear answer, say so and propose an empirical test rather than a confident-sounding synthesis of assumptions.

- [2026-03-24] [injected reasoning format] TMK (Task-Method-Knowledge) hybrid is the strongest evidence-backed format for injecting cognitive frameworks into LLM context. Procedural steps + teleological rationale ("why this step matters") outperforms pure declarative assertions or pure procedural steps for application tasks (ACL 2024, Georgia Tech TMK paper 2025). Natural language outperforms JSON/YAML for reasoning (Salewski 2024, Ren 2024). Direct model-addressed instructions outperform impersonal assertions (practitioner consensus, Anthropic/OpenAI docs). Context rot is real — 500-800 words per framework is optimal (Chroma 2025). Caveat: no published research directly A/B tests framework injection for advisory reasoning specifically. Full research at `projects/kinetic/research/2026-03-24-framework-injection-format-research.md`.

- [2026-03-24] [framework value assessment] Originality test for injected frameworks: "Would a vanilla LLM produce the same advice without this framework injected?" If yes, the framework adds no value. For ICP-facing advisory agents, business-strategy frameworks add more value than AI-technical frameworks (the LLM already has strong AI knowledge). Category balance in a framework library should match the user's problem space, not the author's content distribution. Semantic retrieval means category caps are unnecessary — trigger quality matters, not category count.

- [2026-03-24] [trigger phrase design] Author-vocabulary triggers produce poor retrieval (1/7 correct in testing). User-language triggers — written in the vocabulary the ICP would actually type — are the single highest-leverage improvement for framework selection quality. Each framework needs triggers that describe the user's felt problem, not the framework's domain label.
