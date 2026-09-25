// Shared distance: twice the travel before a frame or scene advances.
export const PX_PER_FRAME = 16;
export const SCROLL_SCRUB = 1;
// Non-image scenes share a 150-frame logical animation duration.
export const SCENE_FRAME_COUNT = 150;
export const scrollDistanceForFrames = (frameCount: number) => frameCount * PX_PER_FRAME;
