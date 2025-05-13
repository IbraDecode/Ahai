const express = require('express');
const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const OUTPUT_DIR = path.join(__dirname, '../output');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

app.post('/generate', async (req, res) => {
  const { html } = req.body;

  // Simpan file sementara
  const tempHtmlPath = path.join(OUTPUT_DIR, 'temp.html');
  fs.writeFileSync(tempHtmlPath, html);

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-gpu', '--no-sandbox', '--window-size=800,600'],
  });

  const page = await browser.newPage();
  await page.goto(`file://${tempHtmlPath}`);

  // Buat video menggunakan ffmpeg
  const videoPath = path.join(OUTPUT_DIR, 'output.mp4');
  const ffmpeg = spawn('ffmpeg', [
    '-f', 'x11grab',
    '-video_size', '800x600',
    '-framerate', '30',
    '-i', ':0.0+0,0',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-pix_fmt', 'yuv420p',
    videoPath
  ]);

  setTimeout(async () => {
    ffmpeg.kill();
    await browser.close();

    // Ganti dengan fungsi upload ke Google Drive/MediaFire
    const downloadLink = 'https://example.com/output.mp4 '; // Dummy link
    res.json({ downloadLink });
  }, 30000); // Rekam selama 30 detik
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));