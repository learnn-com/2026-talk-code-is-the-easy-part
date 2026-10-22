# Code is the easy part

Repository di supporto al talk **«Code is the easy part»** di Omar Diop e Gianluca Carucci (Learnn).

E se il salto più importante dell'AI non fosse farci lavorare più velocemente, ma farci **costruire insieme**?

Partiamo dall'MVP di Learnn del 2020 (45 giorni, 5 sprint) e lo rifacciamo con l'AI e [PAIR](https://pair.foomakers.com), il process layer open source che guida l'AI dal PRD alla code review. Funziona e siamo più veloci, ma ogni passo lo guidiamo ancora noi del team tech e gli stakeholder restano fuori. Il talk mostra come portarli nella stessa conversazione: un refinement asincrono in un thread Slack con Claude Tag, dove l'AI fa le domande e le persone rispondono. Poi cosa succede quando la co-creazione si estende a tutta l'azienda: classificazione del rischio, gate e criteri di autonomia.

## Cosa contiene

- `.pair/`: Knowledge Base e adoption di PAIR usate nella demo: PRD, decisioni tecniche, way of working.
- `.claude/skills/` e simili: le skill PAIR installate per gli assistenti AI.
- `assets/`: video, screenshot e immagini usati nelle slide.

È lo stesso progetto che mostriamo nel talk: l'MVP di Learnn ricostruito con PAIR, dal PRD al backlog fino allo sviluppo.

## Demo: sviluppo del primo sprint

```bash
git checkout demo-start
pnpm install
```

Servono Node.js 18+, pnpm e un code assistant (Claude Code, Codex, pi o opencode). `pair-cli` è già nelle `devDependencies` (`pnpm pair …`).

### Le tre modalità

Raffinamento e sviluppo delle 5 storie dello sprint 1, in Draft nel backlog. Dettagli di ogni modalità nella [guida PAIR](https://pair.foomakers.com/docs/process-lifecycle/lifecycle-modes).

1. **Assistita**: [video](assets/pair-assisted-mode.mp4).
2. **Supervisionata**: una card dal Draft alla PR, la rivede l'umano.

Con la skill, in sessione:

```text
/pair-workflow-cycle 01-01-001-login-email-password
```

Con il comando, da shell:

```bash
pnpm pair run --card 01-01-001-login-email-password --prepare never
```

3. **Autonoma**: tutto il backlog, fino al merge, senza fermarsi. Prima la policy (`prepare: never`, `until: merged`, `merge: never`, `max-iterations: 20`) con `/pair-assistant`: [guida](https://pair.foomakers.com/docs/tutorials/automated-development).

Con la skill, in sessione:

```text
/pair-loop
```

Con il comando, da shell:

```bash
pnpm pair run --root IN-01 --autonomous
```

## Risorse

- [PAIR, website](https://pair.foomakers.com)
- [PAIR, documentazione](https://pair.foomakers.com/docs)
- [PAIR su GitHub](https://github.com/foomakers/pair)

## Autori

- Omar Diop, Head of Engineering @ Learnn: [LinkedIn](https://it.linkedin.com/in/omar-diop-dev), [omardiop.com](https://omardiop.com)
- Gianluca Carucci, CTO & COO @ Learnn: [LinkedIn](https://it.linkedin.com/in/rucka)

## Webapp

App React in [`apps/webapp`](apps/webapp/README.md): avvio, utenti demo del login mock, build statica.
