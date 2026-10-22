// filesystem.mjs — PM tool = markdown files under .pair/adoption/product/backlog/ (filesystem-implementation.md).
// Card = `<id>-<slug>.md` (or `<id>.md`) in 03-user-stories|02-epics|01-initiatives/<state folder>/. State = folder +
// the `**Status**:` line. Labels = a `**Labels**:` line (comma-separated). Comments = marker-keyed blocks under
// `## Automation Comments`. PM side only: the code side (PRs) is a different tool — declare `code-host` (github).
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'
import { defineAdapter, HostError } from './adapter-kit.mjs'

const ID_RE = /^[A-Za-z0-9][A-Za-z0-9._-]*$/
const KINDS = ['03-user-stories', '02-epics', '01-initiatives']
const FOLDER = { Draft: 'not-started', Ready: 'not-started', 'In Progress': 'in-progress', Review: 'under-review', Done: 'completed' }
const STATUS_TEXT = { Draft: 'Todo (Draft)', Ready: 'Todo (Ready)', 'In Progress': 'In Progress', Review: 'Under Review', Done: 'Done' }
const STATUS_RE = /^(\*\*Status\*\*:?:?\s*).*$/m
const LABELS_RE = /^\*\*Labels\*\*:\s*(.*)$/m
const CLOSE = '<!-- /pair-comment -->'

const noCodeHost = method => () => {
  throw new HostError('unsupported', { message: `filesystem is a PM tool only: ${method} needs a code host — declare \`code-host\` in way-of-working.md`, method })
}
const walk = dir => (existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).flatMap(e => (e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith('.md') ? [join(dir, e.name)] : [])) : [])

export default defineAdapter({
  id: 'filesystem',
  aliases: ['file system', 'files', 'markdown'],
  hostsCode: false,
  binaries: [],
  create(transport = {}) {
    const root = transport.root ?? join(process.cwd(), '.pair', 'adoption', 'product', 'backlog')
    const safe = id => {
      if (!ID_RE.test(String(id)) || String(id).includes('..')) throw new HostError('invalid-input', { message: `invalid card id ${JSON.stringify(id)}` })
      return String(id)
    }
    const find = id => {
      const want = safe(id)
      for (const kind of KINDS) {
        for (const f of walk(join(root, kind))) {
          const name = basename(f, '.md')
          if (name === want || (name.startsWith(`${want}-`) && !/^\d/.test(name.slice(want.length + 1)))) return f
          if (kind === '01-initiatives' && new RegExp(`\\*\\*Initiative ID:\\*\\*\\s*${want.replace(/[.]/g, '\\.')}\\b`).test(readFileSync(f, 'utf8'))) return f
        }
      }
      throw new HostError('failed', { command: `read card ${want}`, detail: `no card ${want} under ${root}` })
    }
    const read = id => {
      const file = find(id)
      return { file, body: readFileSync(file, 'utf8') }
    }
    const labelsOf = body => (LABELS_RE.exec(body)?.[1] ?? '').split(',').map(s => s.trim()).filter(Boolean)
    const withLabels = (body, labels) => {
      const line = `**Labels**: ${labels.join(', ')}`
      if (LABELS_RE.test(body)) return body.replace(LABELS_RE, line)
      return STATUS_RE.test(body) ? body.replace(STATUS_RE, m => `${m}\n${line}`) : `${line}\n\n${body}`
    }
    const titleOf = body => {
      const lines = body.split('\n')
      const i = lines.findIndex(l => /^##\s+Title/i.test(l))
      const t = (i >= 0 ? lines.slice(i + 1).find(l => l.trim()) : lines.find(l => l.trim())) ?? ''
      return t.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim()
    }
    const write = (file, body) => writeFileSync(file, body)
    const moveTo = (file, folder) => {
      const kindDir = dirname(dirname(file))
      const dest = join(kindDir, folder, basename(file))
      if (dest === file) return file
      mkdirSync(dirname(dest), { recursive: true })
      renameSync(file, dest)
      return dest
    }
    const setState = (id, state) => {
      const { file, body } = read(id)
      const text = STATUS_TEXT[state] ?? state
      const next = STATUS_RE.test(body) ? body.replace(STATUS_RE, (_, p) => `${p}${text}`) : body
      write(file, next)
      if (FOLDER[state]) moveTo(file, FOLDER[state])
    }
    const blocks = body => {
      const out = []
      const re = /(<!-- pair:[^>]*-->)\n([\s\S]*?)\n<!-- \/pair-comment -->/g
      let m
      while ((m = re.exec(body))) out.push({ id: out.length + 1, marker: m[1], body: `${m[1]}\n${m[2]}`, raw: m[0] })
      return out
    }
    const parentOf = body => {
      const m = /\*\*Parent Epic\*\*:\s*\[[^\]]*\]\(([^)]+)\)/.exec(body)
      return m ? basename(m[1], '.md') : null
    }
    const idOfFile = f => /^(\d+(?:-\d+)*)/.exec(basename(f, '.md'))?.[1] ?? basename(f, '.md')

    return {
      checkContext: 'pair-review',
      stateLabels: ['pr-state:to-be-reviewed', 'pr-state:ready-to-merge', 'pr-state:not-approved'],
      errorPrefix: 'fs',

      readCard(id, { fields } = {}) {
        const { file, body } = read(id)
        if (!fields) return { body }
        const all = { number: String(id), url: relative(process.cwd(), file), title: titleOf(body), body, labels: labelsOf(body).map(name => ({ name })), state: basename(dirname(file)) === 'completed' ? 'CLOSED' : 'OPEN' }
        return Object.fromEntries(fields.map(f => [f, all[f]]))
      },
      findCards({ search }) {
        const q = String(search ?? '').toLowerCase()
        return KINDS.flatMap(k => walk(join(root, k))).map(f => ({ f, body: readFileSync(f, 'utf8') })).filter(({ f, body }) => `${basename(f)}\n${body}`.toLowerCase().includes(q)).map(({ f, body }) => ({ number: idOfFile(f), url: relative(process.cwd(), f), title: titleOf(body), body }))
      },
      createCard({ title, body }) {
        const dir = join(root, '03-user-stories', 'not-started')
        mkdirSync(dir, { recursive: true })
        const slug = String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'card'
        const file = join(dir, `${slug}.md`)
        write(file, body)
        return { url: relative(process.cwd(), file) }
      },
      updateCard({ id, body }) {
        write(find(id), body)
        return { id }
      },
      parseCardRef(ref) {
        const m = /(?:^|\/)(\d+(?:-\d+)*|IN-\d+)(?:-[^/]*)?\.md$/.exec(String(ref ?? '')) ?? /^#?([A-Za-z0-9][A-Za-z0-9._-]*)$/.exec(String(ref ?? ''))
        return m ? { number: m[1], inScope: true } : null
      },
      closeAndCascade({ id }) {
        const { body } = read(id)
        const parent = parentOf(body)
        setState(id, 'Done')
        const closed = [String(id)]
        if (!parent) return { closed, stoppedAt: null }
        let epic
        try {
          epic = read(parent)
        } catch {
          return { closed, stoppedAt: parent }
        }
        const kids = walk(join(root, '03-user-stories')).filter(f => parentOf(readFileSync(f, 'utf8')) === basename(epic.file, '.md'))
        if (kids.some(f => basename(dirname(f)) !== 'completed')) return { closed, stoppedAt: parent }
        setState(parent, 'Done')
        closed.push(idOfFile(epic.file))
        return { closed, stoppedAt: null }
      },
      setBoardState({ id, state }) {
        try {
          setState(id, state)
          const { file } = read(id)
          const ok = !FOLDER[state] || basename(dirname(file)) === FOLDER[state]
          return { applied: state, confirmed: ok, error: ok ? null : `read-back: card ${id} is in ${basename(dirname(file))}` }
        } catch (e) {
          return { applied: state, confirmed: false, error: e.message }
        }
      },
      labelCard({ id, label }) {
        try {
          const { file, body } = read(id)
          const labels = labelsOf(body)
          if (!labels.includes(label)) write(file, withLabels(body, [...labels, label]))
          const has = labelsOf(read(id).body).includes(label)
          return { applied: label, confirmed: has, error: has ? null : `read-back: label ${JSON.stringify(label)} is not on card ${id}` }
        } catch (e) {
          return { applied: label, confirmed: false, error: e.message }
        }
      },
      unlabelCard({ id, label }) {
        try {
          const { file, body } = read(id)
          write(file, withLabels(body, labelsOf(body).filter(l => l !== label)))
          const has = labelsOf(read(id).body).includes(label)
          return { removed: label, confirmed: !has, error: has ? `read-back: label ${JSON.stringify(label)} is still on card ${id}` : null }
        } catch (e) {
          return { removed: label, confirmed: false, error: e.message }
        }
      },
      commentOnCard({ id, marker, body: text }) {
        const { file, body } = read(id)
        const full = `${marker}\n${String(text ?? '').replace(/^﻿/, '').split('\n')[0].trim() === marker ? String(text).split('\n').slice(1).join('\n') : text}`
        const hits = blocks(body).filter(b => b.body.startsWith(marker))
        if (hits.length > 1) return { error: 'marker-ambiguous', ids: hits.map(h => h.id), marker }
        const block = `${full}\n${CLOSE}`
        if (hits.length === 1) {
          if (hits[0].raw === block) return { action: 'unchanged', id: hits[0].id, url: relative(process.cwd(), file), marker }
          write(file, body.replace(hits[0].raw, () => block))
          return { action: 'updated', id: hits[0].id, url: relative(process.cwd(), file), marker }
        }
        const head = /^## Automation Comments\s*$/m.test(body) ? '' : '\n## Automation Comments\n'
        write(file, `${body.replace(/\s*$/, '\n')}${head}\n${block}\n`)
        return { action: 'created', id: blocks(read(id).body).length, url: relative(process.cwd(), file), marker }
      },

      prHead: noCodeHost('prHead'),
      upsertComment: noCodeHost('upsertComment'),
      concludeCheck: noCodeHost('concludeCheck'),
      setPrState: noCodeHost('setPrState'),
      merge: noCodeHost('merge'),
    }
  },
})
