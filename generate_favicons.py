#!/usr/bin/env python3
"""
Gera favicon.ico e PNGs em múltiplos tamanhos a partir do logo.svg
"""
import os
from PIL import Image
import cairosvg

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), 'public')
SVG_FILE = os.path.join(PUBLIC_DIR, 'logo.svg')

# Tamanhos padrão de favicon
SIZES = [16, 32, 48, 64, 128, 256]

def generate_favicons():
    print("🎨 Gerando favicons a partir do logo.svg...")

    # Gerar PNGs temporários
    png_files = []
    for size in SIZES:
        output_path = os.path.join(PUBLIC_DIR, f'favicon-{size}x{size}.png')
        print(f"  → Gerando {size}x{size}...")

        cairosvg.svg2png(
            url=SVG_FILE,
            write_to=output_path,
            output_width=size,
            output_height=size,
            background_color='white'
        )
        png_files.append(output_path)

    # Gerar favicon.ico multi-resolução
    print("  → Gerando favicon.ico...")
    images = [Image.open(png) for png in png_files]
    ico_path = os.path.join(PUBLIC_DIR, 'favicon.ico')
    images[0].save(
        ico_path,
        format='ICO',
        sizes=[(size, size) for size in SIZES]
    )

    # Manter apenas as principais
    print("  → Limpando arquivos temporários...")
    for png in png_files:
        if '16x16' not in png and '32x32' not in png and '192x192' not in png:
            os.remove(png)

    # Renomear para padrões comuns
    os.rename(
        os.path.join(PUBLIC_DIR, 'favicon-16x16.png'),
        os.path.join(PUBLIC_DIR, 'favicon-16x16.png')
    )
    os.rename(
        os.path.join(PUBLIC_DIR, 'favicon-32x32.png'),
        os.path.join(PUBLIC_DIR, 'favicon-32x32.png')
    )

    # Criar apple-touch-icon (180x180)
    print("  → Gerando apple-touch-icon.png...")
    cairosvg.svg2png(
        url=SVG_FILE,
        write_to=os.path.join(PUBLIC_DIR, 'apple-touch-icon.png'),
        output_width=180,
        output_height=180,
        background_color='white'
    )

    # Criar android-chrome (192x192 e 512x512)
    print("  → Gerando android-chrome-192x192.png...")
    cairosvg.svg2png(
        url=SVG_FILE,
        write_to=os.path.join(PUBLIC_DIR, 'android-chrome-192x192.png'),
        output_width=192,
        output_height=192,
        background_color='white'
    )

    print("  → Gerando android-chrome-512x512.png...")
    cairosvg.svg2png(
        url=SVG_FILE,
        write_to=os.path.join(PUBLIC_DIR, 'android-chrome-512x512.png'),
        output_width=512,
        output_height=512,
        background_color='white'
    )

    print("✅ Favicons gerados com sucesso!")
    print(f"   - favicon.ico (multi-resolução)")
    print(f"   - favicon-16x16.png")
    print(f"   - favicon-32x32.png")
    print(f"   - apple-touch-icon.png")
    print(f"   - android-chrome-192x192.png")
    print(f"   - android-chrome-512x512.png")
    print(f"   - favicon.svg (mantido)")

if __name__ == '__main__':
    generate_favicons()
