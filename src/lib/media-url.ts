import manifest from "./cloudinary-manifest.json";

const urls: Record<string, string> = manifest;

export function mediaUrl(localPath: string) {
  return urls[localPath] ?? localPath;
}
