# Cloudinary delivery

The site uses the public URLs in `src/lib/cloudinary-manifest.json`. Commit this
file with the code; it contains no credentials. No Cloudinary credentials are
required on Netlify for normal delivery or builds.

## Refresh uploads

1. Keep credentials only in ignored `.env.local` using `CLOUDINARY_CLOUD_NAME`,
   `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. Never use NEXT_PUBLIC for secrets.
2. Run `npm run frames:optimize` after changing local sequences.
3. Upload corresponding files into `amoghya-tech/frames-webp/frame-N`.
4. Run `npm run media:sync`. This reads metadata only; it never uploads or deletes.
5. Run `node scripts/test-cloudinary.cjs` to validate coverage and sample delivery.
6. Run `npm run build`, commit the manifests and code, then deploy.

The sync prefers existing WebPs. Missing optimized frames are looked up in
`amoghya-tech/frames/frame-N`. PNGs use a 1120px WebP transformation; first-time
requests may take longer and consume Cloudinary transformation credits. Duplicate
same-format frames and missing assets fail the sync rather than guessing.

Keep the local originals and optimized files available: `prebuild` still needs the
originals, and the cache retains local WebP/PNG fallbacks. Do not remove these folders
until the build and fallback workflow has explicitly been changed.

The intro streams the uploaded MP4 into the existing canvas, then hands off to the
scroll sequence after playback ends. Frame-sequence playback remains the fallback
if autoplay or video delivery fails. Handoff frames are prefetched during playback.
Main AMO images use Cloudinary through MediaImage, with a local error fallback. Older
unused scene components may still refer to local assets.

Netlify: repository root base directory, `npm run build`, `.next` publish directory,
automatic Next.js adapter. No media-base environment variable is needed with this
manifest approach. Check the deployed Network panel for Cloudinary requests, errors,
and unexpected repeated local fallback downloads before announcing the site live.
