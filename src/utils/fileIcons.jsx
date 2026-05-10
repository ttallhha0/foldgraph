import {
  SiPython, SiJavascript, SiTypescript, SiReact, SiGo, SiRust,
  SiVuedotjs, SiSvelte, SiDart, SiCplusplus, SiC, SiKotlin,
  SiSwift, SiHtml5, SiSass, SiMarkdown, SiGnubash,
  SiDocker, SiTerraform, SiGraphql, SiPhp, SiRuby, SiScala,
  SiHaskell, SiElixir, SiLua, SiR, SiGit, SiPrisma, SiJson,
  SiYaml, SiFlutter, SiLaravel, SiAngular, SiNextdotjs, SiNuxt,
  SiDotnet, SiCss,
} from 'react-icons/si';
import { DiJava } from 'react-icons/di';
import { VscFile } from 'react-icons/vsc';

// [icon component, hex color]
const EXT_MAP = {
  // Web
  js:         [SiJavascript,  '#f7df1e'],
  jsx:        [SiReact,       '#61dafb'],
  ts:         [SiTypescript,  '#3178c6'],
  tsx:        [SiReact,       '#61dafb'],
  vue:        [SiVuedotjs,    '#42b883'],
  svelte:     [SiSvelte,      '#ff3e00'],
  html:       [SiHtml5,       '#e34f26'],
  css:        [SiCss,         '#1572b6'],
  scss:       [SiSass,        '#cc6699'],
  sass:       [SiSass,        '#cc6699'],

  // Backend / Systems
  py:         [SiPython,      '#3776ab'],
  go:         [SiGo,          '#00acd7'],
  rs:         [SiRust,        '#ce4a07'],
  java:       [DiJava,        '#007396'],
  kt:         [SiKotlin,      '#7f52ff'],
  swift:      [SiSwift,       '#f05138'],
  cs:         [SiDotnet,      '#512bd4'],
  php:        [SiPhp,         '#777bb4'],
  rb:         [SiRuby,        '#cc342d'],
  scala:      [SiScala,       '#dc322f'],
  hs:         [SiHaskell,     '#5d4f85'],
  ex:         [SiElixir,      '#4e2a8e'],
  exs:        [SiElixir,      '#4e2a8e'],
  lua:        [SiLua,         '#000080'],
  r:          [SiR,           '#276dc3'],
  dart:       [SiDart,        '#0175c2'],

  // C family
  c:          [SiC,           '#a8b9cc'],
  h:          [SiC,           '#a8b9cc'],
  cpp:        [SiCplusplus,   '#00599c'],
  cc:         [SiCplusplus,   '#00599c'],
  cxx:        [SiCplusplus,   '#00599c'],

  // Config / Data
  json:       [SiJson,        '#cbcb41'],
  yaml:       [SiYaml,        '#cb171e'],
  yml:        [SiYaml,        '#cb171e'],
  toml:       [SiJson,        '#9c4221'],
  md:         [SiMarkdown,    '#ffffff'],
  mdx:        [SiMarkdown,    '#1b9aef'],
  graphql:    [SiGraphql,     '#e10098'],
  gql:        [SiGraphql,     '#e10098'],
  prisma:     [SiPrisma,      '#5a67d8'],
  tf:         [SiTerraform,   '#7b42bc'],
  sql:        [SiJson,        '#e38c00'],

  // Shell / DevOps
  sh:         [SiGnubash,     '#4eaa25'],
  bash:       [SiGnubash,     '#4eaa25'],
  zsh:        [SiGnubash,     '#4eaa25'],
  fish:       [SiGnubash,     '#4eaa25'],

  // Frameworks (by filename convention)
  blade:      [SiLaravel,     '#ff2d20'],
};

// Special full-filename overrides
const NAME_MAP = {
  'dockerfile':    [SiDocker,     '#2496ed'],
  '.gitignore':    [SiGit,        '#f05032'],
  '.env':          [SiGnubash,    '#ecd53f'],
  '.env.local':    [SiGnubash,    '#ecd53f'],
  'pubspec.yaml':  [SiFlutter,    '#54c5f8'],
  'angular.json':  [SiAngular,    '#dd0031'],
  'next.config.js':[SiNextdotjs,  '#ffffff'],
  'nuxt.config.ts':[SiNuxt,       '#00dc82'],
};

export function getFileIcon(filename) {
  const lower = filename.toLowerCase();

  // Full-name match first
  if (NAME_MAP[lower]) return NAME_MAP[lower];

  // Extension match (handles multi-part like .blade.php)
  const parts = lower.split('.');
  if (parts.length >= 3) {
    // e.g. "home.blade.php" → try "blade.php" then "php"
    const compound = parts.slice(-2).join('.');
    if (EXT_MAP[compound]) return EXT_MAP[compound];
  }
  const ext = parts[parts.length - 1];
  if (EXT_MAP[ext]) return EXT_MAP[ext];

  return [VscFile, '#6b7280'];
}
