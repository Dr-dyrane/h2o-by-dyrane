const fs = require('fs');
const path = require('path');

const showcaseDir = 'public/showcase';

function getPngDims(filePath) {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(24);
    fs.readSync(fd, buffer, 0, 24, 0);
    fs.closeSync(fd);
    
    // PNG signature check
    if (buffer[0] !== 0x89 || buffer[1] !== 0x50 || buffer[2] !== 0x4E || buffer[3] !== 0x47) {
      return null;
    }

    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
  } catch (e) {
    return null;
  }
}

if (fs.existsSync(showcaseDir)) {
  const files = fs.readdirSync(showcaseDir).filter(f => f.endsWith('.png'));
  files.forEach(f => {
    const dims = getPngDims(path.join(showcaseDir, f));
    if (dims) {
      console.log(`${f}: ${dims.width}x${dims.height} Ratio: ${(dims.width/dims.height).toFixed(3)}`);
    } else {
      console.log(`${f}: Could not read or not a PNG`);
    }
  });
} else {
  console.log("Directory NOT found: " + showcaseDir);
}
