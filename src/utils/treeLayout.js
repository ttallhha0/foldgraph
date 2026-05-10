const NODE_W = 180;
const NODE_H = 55;
const H_GAP = 16;
const V_GAP = 50;

export function computeTreeLayout(nodes, edges) {
  if (nodes.length === 0) return [];

  const childrenMap = {};
  const hasParent = new Set();

  edges.forEach(({ source, target }) => {
    if (!childrenMap[source]) childrenMap[source] = [];
    childrenMap[source].push(target);
    hasParent.add(target);
  });

  const root = nodes.find((n) => !hasParent.has(n.id));
  if (!root) return nodes;

  const widths = {};

  function calcWidth(id) {
    const ch = childrenMap[id] || [];
    if (ch.length === 0) {
      widths[id] = NODE_W;
      return NODE_W;
    }
    const total =
      ch.reduce((s, c) => s + calcWidth(c), 0) + (ch.length - 1) * H_GAP;
    widths[id] = Math.max(NODE_W, total);
    return widths[id];
  }

  calcWidth(root.id);

  const positions = {};

  function place(id, left, top) {
    const w = widths[id];
    positions[id] = { x: left + w / 2 - NODE_W / 2, y: top };
    let cur = left;
    (childrenMap[id] || []).forEach((cid) => {
      place(cid, cur, top + NODE_H + V_GAP);
      cur += widths[cid] + H_GAP;
    });
  }

  place(root.id, 0, 0);

  return nodes.map((n) => ({
    ...n,
    position: positions[n.id] || n.position,
  }));
}
