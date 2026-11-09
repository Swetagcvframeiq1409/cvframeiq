import asyncio
from playwright.async_api import async_playwright
import os, base64

img_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets', 'img'))
out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', '_review', 'prompt-37', 'before'))
os.makedirs(out_dir, exist_ok=True)

targets = [
    'aviation.webp',
    'healthcare.webp',
    'Agriculture.webp',
    'smartagriculture.webp',
    'agricultureai.webp',
    'securitysurveillance.webp',
    'smart-cities.webp',
    'ismart-city-hero.webp',
]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1200, 'height': 900})
        for name in targets:
            path = os.path.join(img_dir, name)
            if not os.path.exists(path):
                print(f"MISSING: {name}")
                continue
            with open(path, 'rb') as f:
                data = base64.b64encode(f.read()).decode()
            ext = name.split('.')[-1]
            mime = 'image/webp' if ext == 'webp' else f'image/{ext}'
            html = f'<html><body style="margin:0;background:#000"><img src="data:{mime};base64,{data}" style="max-width:100%;max-height:100vh;display:block"></body></html>'
            await page.set_content(html)
            await page.wait_for_timeout(300)
            out = os.path.join(out_dir, name.replace('.webp', '.png').replace('.jpg', '.png'))
            await page.screenshot(path=out, full_page=False)
            print(f"Saved: {out}")
        await browser.close()

asyncio.run(main())
