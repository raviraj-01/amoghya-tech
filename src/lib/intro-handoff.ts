type Point = { x: number; y: number };

// Helmet and grounded-foot centres measured in the original 1920x1080 frames.
// Two landmarks preserve the leaning angle as well as position and scale.
export const INTRO_ANCHORS = {
  outgoing: [{ x: 627, y: 210 }, { x: 552, y: 738 }],
  incoming: [{ x: 1058, y: 192 }, { x: 862, y: 1038 }],
} satisfies Record<string, [Point, Point]>;

export function introHandoffTransform(progress: number) {
  const [sourceHead, sourceFoot] = INTRO_ANCHORS.incoming;
  const [targetHead, targetFoot] = INTRO_ANCHORS.outgoing;
  const source = { x: sourceFoot.x - sourceHead.x, y: sourceFoot.y - sourceHead.y };
  const target = { x: targetFoot.x - targetHead.x, y: targetFoot.y - targetHead.y };
  const lengthSquared = source.x ** 2 + source.y ** 2;
  const a = (source.x * target.x + source.y * target.y) / lengthSquared;
  const b = (source.x * target.y - source.y * target.x) / lengthSquared;
  const tx = targetHead.x - a * sourceHead.x + b * sourceHead.y;
  const ty = targetHead.y - b * sourceHead.x - a * sourceHead.y;
  const t = Math.min(1, Math.max(0, progress / 0.45));
  const eased = t * t * (3 - 2 * t);
  const remaining = 1 - eased;

  return { a: 1 + (a - 1) * remaining, b: b * remaining, tx: tx * remaining, ty: ty * remaining };
}
