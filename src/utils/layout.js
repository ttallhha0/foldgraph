import dagre from 'dagre';

const NODE_WIDTH  = 180;
const NODE_HEIGHT = 55;

/**
 * Verilen nodes ve edges'e Dagre ile otomatik hiyerarşik koordinat atar.
 *
 * @param {Array}  nodes      - React Flow node dizisi
 * @param {Array}  edges      - React Flow edge dizisi
 * @param {string} direction  - 'TB' (yukarıdan aşağıya) | 'LR' (soldan sağa)
 * @returns {{ nodes: Array, edges: Array }}
 */
export function getLayoutedElements(nodes, edges, direction = 'TB') {
  const g = new dagre.graphlib.Graph();

  g.setGraph({
    rankdir:  direction,  // 'TB' veya 'LR'
    ranksep:  60,         // düğüm katmanları arası boşluk
    nodesep:  24,         // aynı kattaki düğümler arası boşluk
    edgesep:  10,
    marginx:  32,
    marginy:  32,
  });

  g.setDefaultEdgeLabel(() => ({}));

  // Düğümleri dagre grafiğine ekle
  nodes.forEach((node) => {
    g.setNode(node.id, {
      width:  node.width  ?? NODE_WIDTH,
      height: node.height ?? NODE_HEIGHT,
    });
  });

  // Edge'leri dagre grafiğine ekle
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  // Dagre'nin hesapladığı merkez koordinatları → React Flow'un sol-üst köşe formatına çevir
  const layoutedNodes = nodes.map((node) => {
    const { x, y, width, height } = g.node(node.id);
    return {
      ...node,
      position: {
        x: x - width  / 2,
        y: y - height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
