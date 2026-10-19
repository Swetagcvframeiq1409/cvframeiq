# Photo sources and credits

## Local photo workflow

Add licensed JPEG files to this folder using the exact slot filename, such as `sector-banking.jpg` or `gear-camera-2.jpg`. Use 1600×900 images where practical and keep each file under 300 KB. Smaller cards use the same source image and crop it with `object-fit: cover`.

After adding or removing photos, run:

`powershell -ExecutionPolicy Bypass -File scripts\update-photos.ps1`

Then hard-refresh the site with Ctrl+F5. The script updates `assets/data/local-photos.js`; only listed slots are requested, so absent photos never cause 404s. If the list is missing or empty, all slots display designed gradient-and-icon tiles.

LoremFlickr was unreliable (HTTP 500) and remote photos are disabled in `assets/data/images.js`. Keep `USE_TEMP_REMOTE: false` unless remote images are explicitly re-enabled and verified.

## Image files and credits

The following files were copied from the current live site for review. Creator identity and reuse/commercial-use permissions were not verified during capture. Confirm the original source and applicable license for every file before production; a direct image URL is a source record, not proof of a license.

| File | Source URL | Creator | License / attribution |
|---|---|---|---|
| `sector-banking.jpg` | `https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&q=80&w=1000` | Unsplash creator not identified | Verify source page and license before launch |
| `sector-aviation.jpg` | `https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&q=80&w=1000` | Unsplash creator not identified | Verify source page and license before launch |
| `sector-smart-city.jpg` | `https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&q=80&w=1000` | Unsplash creator not identified | Verify source page and license before launch |
| `sector-security.jpg` | `https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=1000` | Unsplash creator not identified | Verify source page and license before launch |
| `sector-healthcare.jpg` | `https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1000` | Unsplash creator not identified | Verify source page and license before launch |
| `sector-events.jpg` | `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000` | Unsplash creator not identified | Verify source page and license before launch |
| `sector-manufacturing.jpg` | `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000` | Unsplash creator not identified | Verify source page and license before launch |
| `gear-board.jpg` | `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800` | Unsplash creator not identified | Verify source page and license before launch |
| `gear-devboard.jpg` | `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800` | Unsplash creator not identified | Verify source page and license before launch |
| `blog-traffic.jpg` | `https://cvframeiq.com/blog/Revolutionizing%20Traffic%20Management%20with%20AI.jpg` | Not identified on the live page | Confirm original source and reuse rights |
| `blog-edge-cloud.jpg` | `https://cvframeiq.com/blog/Edge%20vs%20Cloud%20Video%20Analytic%20What%23U0393%23U00c7%23U00d6s%20Right%20for%20You.jpg` | Not identified on the live page | Confirm original source and reuse rights |
| `blog-agriculture.jpg` | `https://cvframeiq.com/blog/drone-spraying-fertilizer-vegetable-green-plants-agriculture-technology-farm-automation.jpg` | Not identified on the live page | Confirm original source and reuse rights |

No photo was retained for the mismatched or broken Gear slots. They remain designed tiles:

- `gear-camera`: live image was electronic circuit artwork rather than the listed camera.
- `gear-camera-2`: live Industrial CV Camera image failed to load.
- `gear-processor`: live Edge AI Processor X1 image depicted a phone.
- `gear-sensor`: live Multi-Sensor Array image was a generic processor-board close-up, not a sensor array.

The remaining unfilled photo slots are listed in `assets/data/images.js`; provide a licensed photo and add its source, creator, and license above before enabling it.
