# Product Requirements Document (PRD)

## 1. Overview

**Product Name:** Learnn  
**Version:** 1.1  
**Date:** 12 aprile 2026  
**Owner:** Product Team (fondatore / leadership prodotto)

### Executive Summary

Learnn è una piattaforma in abbonamento (da €9,99/mese) che offre streaming di lezioni e webinar verticali sul digitale tenuti da professionisti in attività (“practitioner”), non da guru o influencer. **L’MVP in sviluppo è una webapp mobile-first sviluppata in-house** (frontend React, backend REST dedicato, contenuti e database su cloud es. AWS), sostituendo l’ipotesi iniziale di area membri su piattaforma terze: obiettivo è controllo completo su test, modifiche e roadmap prodotto. L’esperienza compete sul piano dell’attrattiva con l’intrattenimento (Netflix, Spotify, ecc.) pur mantenendo ROI formativo elevato rispetto ai corsi tradizionali.

## 2. Product Vision & Mission

### Vision

Rendere il sapere digitale pratico tanto accessibile e desiderabile quanto l’intrattenimento, per persone che vogliono fare e non solo guardare, e alzare il livello di competenze del mercato italiano verso standard globali.

### Mission

Dare voce a professionisti che lavorano sul campo; supportare (non sostituire) l’educazione ufficiale con contenuti online aggiornati, fruibili in autonomia; rimuovere barriere di costo non necessarie focalizzandosi sull’esito per gli studenti; costruire meritocrazia basata sulle competenze, non su titoli o personal brand.

## 3. Problem Statement

### Current State

L’educazione tradizionale è lenta rispetto al digitale, spesso teorica e costosa rispetto al ritorno occupazionale; copre poche materie rispetto al mercato e valuta in modo standardizzato invece di favorire autonomia e motivazione. In Italia, PMI e contesto imprenditoriale soffrono di scarsa digitalizzazione e mancanza di esempi positivi. I corsi online nati come alternativa pratica sono diventati un mercato redditizio: molti “formatori” hanno lasciato la pratica e replicano gli stessi limiti. Il tempo libero compete direttamente con piattaforme di intrattenimento a basso attrito e alta abitudine d’uso.

### Pain Points

- **Lentezza e scarsa praticità:** percorsi poco aggiornati e poco collegati al lavoro reale.
- **Costo vs valore:** investimenti alti rispetto alle competenze ottenute.
- **Credibilità della formazione online:** percezione di “fuffa” se prezzo basso o messaggio poco chiaro sul *why*.
- **Competizione con l’intrattenimento:** più facile avviare una serie TV che un percorso di studio — serve rimuovere attriti e alzare qualità percepita.
- **Scalabilità e margini:** per sostenere €9,99/mese vanno tenuti fuori dal piano base costi variabili elevati (es. community pesante) finché il modello non regge volume.

## 4. Goals & Success Metrics

### Primary Goals

1. Validare il **Tier 1** (unico piano in abbonamento a €9,99/mese) come motore di crescita e base per modelli successivi.
2. Rilasciare un **MVP webapp mobile-first** funzionale (autenticazione, catalogo, ricerca, fruizione multi-formato, progressi, note, aree core) entro la finestra pianificata (**Fase 1 — riferimento: metà ottobre**; calendario da confermare a livello di progetto).
3. Raggiungere **qualità percepita** allineata al prezzo (contenuto + UX tipo streaming + chiarezza di valore), evitando associazioni negative “basso costo = bassa qualità”.
4. Costruire **credibilità** con partnership (aziende, università) e contenuti firmati da practitioner riconosciuti.

### Success Metrics (KPIs)

- **Abbonati paganti (validazione business):** target di riferimento: **≥ 2.500** abbonati paganti per considerare la fase iniziale validata e passare a co-creazione / scale-up strutturato.
- **Tasso di disiscrizione (churn):** monitoraggio mensile nei 3–6 mesi successivi al lancio; obiettivo da calibrare su baseline di settore.
- **Utilizzo piattaforma:** sessioni, contenuti avviati/completati, minuti video/audio, eventi chiave player (da strumentare via analytics lato webapp).
- **Costo acquisizione vs LTV:** tenere CAC sotto controllo privilegiando canali low-cost (contenuti, passaparola, eventi, PR, partnership).
- **Qualità contenuti:** standard di produzione (audio/video, slide, coerenza brand) e aggiornamento costante del catalogo.
- **Prodotto:** uptime API/CDN accettabile per consumo video; tempi di caricamento homepage e avvio playback su target mobile (definire SLO in fase di engineering).

## 5. Target Users

### Primary Users

**User Persona 1 — “Marco”, consulente digitale (riferimento)**

- **Demographics:** ~28 anni, Milano, maschio, reddito indicativo ~€1.500/mese, laurea specialistica / bachelor, settore marketing/management, fidanzato, senza figli (prospettiva famiglia in 3–5 anni).
- **Needs:** crescere competenze pratiche (marketing, growth, product, ecc.), tenersi aggiornato senza percorsi lunghi e costosi, ambizione a progetti propri o contributo a PMI familiari.
- **Behaviors:** smartphone frequente; legge tech e news; usa Instagram, LinkedIn, YouTube, podcast; consuma anche Netflix e simili — **competitor diretti per il tempo**, non solo altre scuole.

**User Persona 2 — professionista o freelancer**

- **Demographics:** età e ruoli variabili nell’ambito universitari / professionisti / freelancer interessati a digitale e business (non utenti zero digital literacy).
- **Needs:** apprendere da esperti con esperienza sul campo, esercizi opzionali e percorsi che collegano teoria e pratica.
- **Behaviors:** valuta ROI del tempo; sensibile a brand forti (es. Nike, Apple come riferimento aspirazionale citato nel research).

### User Journey

Scoperta (contenuti gratuiti / social / passaparola) → comprensione del **perché** di Learnn → **checkout abbonamento sul sito web** (fuori dall’app per policy store / semplicità) → **creazione utenza al pagamento** → login webapp (email/password) → **home e discovery** (tipo streaming) → fruizione corsi/lezioni → progressi, note, salvati → (fasi successive) applicazione pratica estesa, referral, connect lavoro/PMI.

## 6. Solution Overview

### Core Solution

Piattaforma **subscription-based** con catalogo di contenuti originali (lezioni, corsi, webinar) su temi digitali. Docenti: **solo practitioner**. Il prodotto software MVP è una **webapp responsive, mobile-first**, con navigazione e UI ispirate ai servizi di streaming (righe orizzontali, copertine, sezioni tipo “Continua a guardare”, categorie, ecc.).

### Information architecture (superfici principali)

| Area | Ruolo |
| ---- | ----- |
| **Area utente / account** | Dati personali, professione, location, link social, immagine; impostazioni; notifiche; aiuto, segnalazione problemi, help center, info app; **stato e scadenza abbonamento (solo lettura)**; link esterno per pagamento/fatturazione (no WebView in-app per vincoli di approvazione store se si pubblicherà come app nativa in futuro). |
| **Discovery** | **Home:** mix di sezioni (es. I tuoi corsi, Finisci di guardare, Nuovi contenuti, Più visti, categorie tipo ecommerce, Prossime uscite). **Search:** ricerca per parola chiave e/o **temi** (lista dinamica da backend/admin). **Coming soon / live:** anteprime corsi in uscita e webinar; tab per filtrare tipologie dove serve. **My Learnn:** contenuti legati all’utente (Fase 1: salvati; Fase 2: promemoria, suggeriti, ecc.). |
| **Fruizione** | **Overview corso/contenuto** (preview stile Netflix: trailer/immagine, titolo, professionista, metadati, tab Lezioni / Professionista / Simili, CTA start, tag, azioni My Learnn e share). **Player lezione:** video (default), audio, testo — **switch in Fase 1 tramite tab** (senza continuità temporale tra formati); **continuità audio/video in tempo reale** in Fase 2 (stile Masterclass). |
| **Navigazione** | **Footer fisso:** Home, Search, Coming soon, My Learnn, Menu (hamburger). **Header (es. solo Home):** logo, link Home, My Learnn, Settings. |

### Key Features

#### Must-Have (P0) — MVP / Fase 1 (target: metà ottobre)

1. **Autenticazione:** login **solo email + password**; utenza creata al **pagamento in checkout** (esterno alla webapp); **reset password** da app con route backend dedicata.
2. **Abbonamento:** in app solo **visualizzazione** stato e scadenza; modifica pagamento/fatturazione tramite **link al sito** (apertura browser esterno, non WebView).
3. **Area utente:** modifica da app di nome, cognome, email, password, immagine, link profili social, professione; billing solo lettura + deep link esterno.
4. **Fruizione contenuto — base:** video (fullscreen, ±15 s, barra avanzamento, qualità manuale), audio (±15 s, avanzamento, riproduzione con schermo spento dove supportato dal browser), testo; **switch formato tramite tab** senza sync posizione tra formati; **riproduzione automatica** al contenuto successivo (annullabile); FAQ base per corso/contenuto (lettura-only).
5. **Ricerca:** su corsi, lezioni, webinar; filtri per **tema** (obbligatorio per corso e lezione; gestione temi in admin); **tag** sulle lezioni; risultati raggruppati per tipologia (corso → pagina corso; contenuto → overview).
6. **My Learnn (Fase 1):** solo **salvati**; suddivisione **corsi salvati** / **lezioni salvate**; azione “Aggiungi a My Learnn” su corso e lezione.
7. **Progressi — base:** corsi **iniziati** in home quando l’utente avvia una lezione; **completamento lezione manuale** (pulsante); lista corsi iniziati in home (**senza** “riprendi da minuto” in Fase 1).
8. **Note:** una **nota testuale per lezione** (1:1 utente–lezione), modificabile, con possibile limite caratteri.
9. **Coming soon — base:** elenco anteprime contenuti e webinar in uscita; promemoria giornalieri **Fase 2**; in Fase 1 notifiche push/email il giorno dell’uscita dove applicabile.
10. **Notifiche:** push tramite servizio tipo **OneSignal**; payload con ID per deep link (es. overview corso); in-app lista notifiche **solo sessione** (non persistite) quando l’app è aperta; niente storico persistente richiesto per MVP informativo.
11. **Stack:** frontend **React**; backend **API REST**; hosting **cloud** (es. AWS) per **video/CDN** e **database**; preferenza **NoSQL** per caratteristiche workload (molte GET, aggiornamenti profilo/preferenze a bassa frequenza) — decisione finale vincolata a ADR engineering.

#### Should-Have (P1) — Seconda release / Fase 2

1. **Switch formato avanzato:** continuità posizione audio ↔ video in tempo reale.
2. **Player avanzato:** sottotitoli (.vtt), qualità preimpostata, controlli estesi (ove non in conflitto con priorità).
3. **Coming soon:** promemoria utente push giorno prima dell’uscita.
4. **My Learnn esteso:** promemoria, Watching esplicito, suggeriti; webinar salvati oltre corsi/lezioni dove previsto.
5. **Statistiche e discovery avanzata:** continua da minuto esatto, contenuti più visti/claps, statistiche uso in area utente, consigliati personalizzati.
6. **Feature social/engagement:** Claps, condivisione copertina/social/storie, FAQ con invio domande, webinar live con commenti in tempo reale.
7. **Note:** sezione aggregata tutte le note per corso/lezione.

#### Could-Have (P2)

1. Test/certificazioni, connect a progetti/lavoro, community avanzata — come da roadmap prodotto di lungo periodo.

## 7. User Stories & Acceptance Criteria

### Epic 1: Autenticazione e abbonamento

**US 1.1** Come utente che ha pagato in checkout voglio accedere alla webapp con email e password così che solo gli abbonati usino i contenuti.

- **AC1:** Login accetta solo email + password valide.
- **AC2:** Flusso “password dimenticata” invia reset e consente impostazione nuova password.
- **AC3:** Account creato in abbinamento al completamento pagamento (integrazione checkout ↔ backend da definire in task tecnici).

**US 1.2** Come abbonato voglio vedere stato e scadenza abbonamento e gestire pagamento sul sito così da rispettare policy store e sicurezza.

- **AC1:** Schermata mostra stato e data scadenza in sola lettura.
- **AC2:** CTA “Gestisci abbonamento” apre il sito in browser esterno (no WebView).
- **AC3:** Nessun acquisto in-app tramite store mobile (per futura app nativa).

### Epic 2: Discovery e catalogo

**US 2.1** Come utente voglio una home in stile streaming così da trovare rapidamente corsi in corso, novità e categorie.

- **AC1:** Home include sezioni configurabili (es. continua, nuovi, più visti, per categoria, prossime uscite).
- **AC2:** Su mobile le card usano aspect ratio **4:5** come riferimento design (allineamento a pattern Netflix-like).
- **AC3:** Tap su elemento porta a overview corso o contenuto coerente.

**US 2.2** Come utente voglio cercare per parola o tema così da trovare contenuti anche quando il tema è sparso su più corsi.

- **AC1:** Search indicizza titoli e tag (e metadati concordati).
- **AC2:** Risultati separati per corsi, contenuti singoli, webinar/live come da specifica.
- **AC3:** Temi sono lista dinamica da API (admin può aggiungere temi).

### Epic 3: Overview e fruizione

**US 3.1** Come utente voglio una pagina overview per ogni corso/contenuto con metadati e tab così da capire cosa guardare e iniziare.

- **AC1:** Overview mostra trailer o immagine, titolo, professionista, numero lezioni, durata, icone formati, descrizione, tag, CTA start.
- **AC2:** Tab: Lezioni, Professionista, Simili (ove dati disponibili).
- **AC3:** Azioni My Learnn e condivisione disponibili dove previsto.

**US 3.2** Come utente voglio guardare/leggere una lezione in video, audio o testo così da scegliere il formato.

- **AC1:** Ingresso default su **video** con controlli ±15 s, avanzamento, qualità (Fase 1).
- **AC2:** Tab per passare a audio e testo; in Fase 1 **nessuna** continuità di timestamp tra formati.
- **AC3:** Audio supporta velocità 0.5x–2x in **Fase 2** (P1); Fase 1 può includere solo controlli base se timeline stretta (da confermare in sprint).

**US 3.3** Come utente voglio passare automaticamente al contenuto successivo così da seguire il corso senza tornare alla lista.

- **AC1:** A fine video/audio (se abilitato) propone/avvia successivo; utente può annullare.

### Epic 4: Progressi, note, salvati

**US 4.1** Come utente voglio che avviando una lezione il corso compaia tra “iniziati” così da ritrovare dove stavo.

- **AC1:** Primo play su lezione di un corso marca il corso come iniziato e lo mostra nella home.

**US 4.2** Come utente voglio segnare una lezione come completata così da vedere avanzamento nel corso.

- **AC1:** Pulsante completamento manuale; stato visibile in UI corso.

**US 4.3** Come utente voglio una nota per lezione così da fissare insight senza uscire dall’app.

- **AC1:** Una nota per lezione; testo semplice; salva/modifica; eventuale limite caratteri.

**US 4.4** Come utente voglio salvare corsi e lezioni in My Learnn così da ritrovarli velocemente.

- **AC1:** Salvataggi separati corsi vs lezioni in Fase 1.

### Epic 5: Notifiche e Coming soon

**US 5.1** Come utente voglio ricevere notifiche per nuovi contenuti rilevanti così da non perdere uscite.

- **AC1:** Push con payload (es. `courseId`) per aprire schermata corretta.
- **AC2:** Con app aperta, lista notifiche non persistente in sessione.

**US 5.2** Come utente voglio vedere cosa uscirà prossimamente così da costruire attesa e pianificare.

- **AC1:** Sezione Coming soon con anteprime; distinzione webinar vs corsi (tab o filtri).

## 8. Technical Considerations

### Architecture Overview

- **Client:** webapp **mobile-first** sviluppata **in-house** con **React**; navigazione SPA (o MPA ibrida se necessario) ottimizzata per touch e viewport ridotte; possibile evoluzione PWA (da decidere).
- **Server:** backend **dedicato** espone **API REST** per autenticazione, catalogo, preferenze, progressi, note, ricerca, configurazione temi/tag.
- **Dati e media:** contenuti video e database su **infrastruttura cloud** (es. **AWS** o equivalente); distribuzione video via CDN/storage compatibile con player web.
- **Database:** **NoSQL** preferito per il profilo di accesso (letture frequenti, aggiornamenti profilo/salvataggi meno frequenti); scelta finale e modellazione in ADR.
- **Autenticazione:** JWT/session server-side + HTTPS; reset password con token monouso.
- **Notifiche:** integrazione **OneSignal** (o equivalente) lato backend + SDK web; segmentazione base.
- **Checkout e billing:** **esterni** alla webapp; webapp riceve solo stato abbonamento tramite API sincronizzata post-pagamento.

### Key Technical Requirements

- **Performance:** TTFB API e LCP homepage entro obiettivi da definire; **time-to-first-frame** video su rete mobile accettabile; caching catalogo dove opportuno.
- **Security:** OWASP ASVS per API; rate limiting login/reset; firma URL o token per asset video; minimizzazione PII.
- **Scalabilità:** stateless API; storage oggetti per media; DB e CDN orizzontalmente scalabili.
- **Integration:** payment provider (web) ↔ webhook → provisioning utente/abbonamento; CMS/admin per contenuti, temi, tag, FAQ.

### Constraints

- **Niente dipendenza da Mighty Network** per il MVP webapp descritto in questo PRD.
- **Billing:** nessun flusso di pagamento dentro la webapp che violi le linee guida Apple se un domani si wrappa in app nativa (pattern: link esterno già richiesto).
- **Sottotitoli .vtt:** posticipati a Fase 2 per costo di produzione e implementazione.
- **Ripresa playback al secondo:** posticipata a Fase 2 (complessità FE/BE).

### Admin / back-office (minimo)

- CRUD temi (obbligatori su corsi/lezioni); gestione tag; contenuti, metadati, FAQ; scheduling “coming soon”; strumenti per invio notifiche (anche via OneSignal).

## 9. Design Requirements

### UI/UX Principles

- **Pattern streaming:** home a sezioni orizzontali; enfasi su copertine e continuità (“Finisci di guardare”).
- **Chiarezza e fiducia:** comunicazione premium; messaggio sul *why* del prezzo.
- **Accessibilità:** contrasti, focus, label form; obiettivo WCAG 2.1 AA progressivo.

### Visual Requirements

- **Copertine mobile:** ratio **4:5** per allineamento a reference Netflix-like su discovery.
- **Brand Learnn:** sistema colori, tipografia, componenti coerenti (player, tab, footer fisso).
- **Responsive:** desktop usabile ma **priorità mobile** per tutte le schermate critiche.

## 10. Timeline & Milestones

### Roadmap prodotto (release)

| Release | Contenuto sintetico | Riferimento temporale (da confermare) |
| ------- | ------------------- | ------------------------------------- |
| **Fase 1 — MVP** | Login, area utente, fruizione video/audio/testo (tab), ricerca temi/tag, My Learnn salvati, progressi base, note, coming soon base, notifiche base, FAQ base | **Metà ottobre** |
| **Fase 2 — Seconda release** | Switch formato avanzato, riprendi da timestamp, promemoria coming soon, My Learnn esteso, statistiche, claps, share, FAQ avanzate, webinar live+commenti, ecc. | Dopo Fase 1 |

### Fasi strategiche (business — invariato)

- Pre-lancio / beta / validazione Tier 1 e canali founder.
- Co-creazione post-trazione: crescita team contenuti e partnership.
- Growth: acquisizione low-cost, PR, università/aziende.

### Dependencies

- Integrazione checkout ↔ provisioning utenti e abbonamenti.
- Pipeline contenuti: upload video, transcoding, hosting, metadati.
- Policy privacy e cookie per UE.

## 11. Risks & Mitigations

| Risk | Impact | Probability | Mitigation Strategy |
| ---- | ------ | ----------- | ------------------- |
| Percepito “basso costo = bassa qualità” | Alto | Medio | UX e produzione curate; messaggio sul *why*; proof practitioner. |
| Scope Fase 1 troppo ampio per la data | Alto | Medio | Congelare backlog Fase 1 come in tabella; Fase 2 esplicita; timeboxing. |
| Complessità sync abbonamento checkout ↔ API | Medio | Medio | Webhook testati; stati idempotenti; schermate errore chiare. |
| Video cost e performance su mobile | Medio | Medio | CDN, bitrate adattivo, metriche playback. |
| Notifiche OneSignal / permessi browser | Medio | Medio | Fallback email; UX richiesta permessi. |
| Competizione con intrattenimento | Alto | Alto | Discovery veloce, qualità contenuto, abitudine d’uso (progressi, note). |

## 12. Launch & Go-to-Market

### Launch Strategy

- Allineamento funnel esistente (Tier 1, canali founder, policy verso acquirenti storici corsi).
- Webapp come veicolo principale di fruizione post-MVP tecnico; comunicare migrazione da eventuali soluzioni precedenti se applicabile.

### Marketing & Communication

- Messaggi: practitioner, accessibilità, qualità; pay-off brand (es. “Just Learnn it”).
- Pre-lancio con contenuti e lista d’attesa dove attivo.

### Support & Documentation

- Help center, FAQ in app, canale segnalazione problemi.

## 13. Post-Launch

### Monitoring & Analytics

- Eventi: login, play, completamento, ricerca, salvataggi, errori player, crash front (se tool dedicato).
- KPI business e churn come sopra.

### Iteration Plan

- Dopo Fase 1: misurare uso real-time switch vs richiesta Fase 2; prioritizzare riprendi da minuto e promemoria.
- Roadmap lungo periodo: connect lavoro/PMI, certificazioni, community.

---

## Appendix

### Research & Data

- Documento di business Learnn (aprile 2026).
- Specifica piattaforma completa + MVP webapp mobile-first + elenco Fase 1 / Fase 2 (aprile 2026).

### Mockups & Prototypes

- Da produrre: wireframe high-fidelity per home 4:5, overview, player con tab formati, footer nav.

### Additional Resources

- Dominio: **learnn.com** — social **@learnn**.

### Document approval

- **Status:** Approved (product owner)  
- **Date:** 12 aprile 2026
