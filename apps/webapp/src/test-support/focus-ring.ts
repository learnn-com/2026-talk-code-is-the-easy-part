import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { compile } from 'tailwindcss'

const SRC_DIR = path.resolve(import.meta.dirname, '..')
const requireFromApp = createRequire(path.resolve(SRC_DIR, '..', 'package.json'))
export const WHITE_INPUT_BACKGROUND = [255, 255, 255] as const
export const MIN_NON_TEXT_CONTRAST = 3

export type Rgb = readonly [number, number, number]

async function buildCss(classes: string[]): Promise<string> {
  const compiler = await compile(fs.readFileSync(path.join(SRC_DIR, 'index.css'), 'utf8'), {
    base: SRC_DIR,
    loadStylesheet: (id, base) => {
      const file = id.startsWith('tailwindcss')
        ? requireFromApp.resolve(id === 'tailwindcss' ? 'tailwindcss/index.css' : `${id}.css`)
        : path.resolve(base, id)
      return Promise.resolve({
        path: file,
        base: path.dirname(file),
        content: fs.readFileSync(file, 'utf8'),
      })
    },
  })
  return compiler.build(classes)
}

function rootVariables(css: string): Map<string, string> {
  const vars = new Map<string, string>()
  for (const block of css.matchAll(/:root[^{]*\{([^}]*)\}/g)) {
    for (const decl of block[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
      vars.set(decl[1], decl[2].trim())
  }
  return vars
}

function resolveVars(value: string, vars: Map<string, string>): string {
  const match = /^var\((--[\w-]+)\)$/.exec(value.trim())
  if (!match) return value.trim()
  const next = vars.get(match[1])
  if (next === undefined) throw new Error(`unresolvable CSS variable ${match[1]}`)
  return resolveVars(next, vars)
}

function oklchToRgb(l: number, c: number, hueDeg: number): Rgb {
  const h = (hueDeg * Math.PI) / 180
  const a = c * Math.cos(h)
  const b = c * Math.sin(h)
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  const linear = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ]
  const encode = (v: number) => {
    const clamped = Math.min(1, Math.max(0, v))
    return 255 * (clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055)
  }
  return [encode(linear[0]), encode(linear[1]), encode(linear[2])]
}

function toRgb(color: string): Rgb {
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color)
  if (hex) {
    const digits = hex[1].length === 3 ? [...hex[1]].map((d) => d + d).join('') : hex[1]
    return [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16)) as unknown as Rgb
  }
  const oklch = /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)/.exec(color)
  if (oklch) {
    const lightness = oklch[2] ? Number(oklch[1]) / 100 : Number(oklch[1])
    return oklchToRgb(lightness, Number(oklch[3]), Number(oklch[4]))
  }
  throw new Error(`unsupported colour ${color}`)
}

function luminance([r, g, b]: Rgb): number {
  const lin = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Colour of the keyboard focus ring a className produces, from the app's real Tailwind build. */
export async function focusRingRgb(className: string): Promise<Rgb> {
  const css = await buildCss(className.split(/\s+/).filter(Boolean))
  const vars = rootVariables(css)
  const rings = [
    ...css.matchAll(
      /\.focus-visible\\:ring-[^:\s{]+:focus-visible\s*\{\s*--tw-ring-color:\s*([^;]+);/g,
    ),
  ]
  const explicit = rings.at(-1)?.[1]
  if (explicit) return toRgb(resolveVars(explicit, vars))
  // No explicit ring colour: Tailwind rings default to currentColor, i.e. the text colour.
  const texts = [...css.matchAll(/\.text-[^:\s{]+\s*\{\s*color:\s*([^;]+);/g)]
  const text = texts.at(-1)?.[1]
  if (!text) throw new Error('toggle has no focus-visible ring colour and no text colour')
  return toRgb(resolveVars(text, vars))
}
