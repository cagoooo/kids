export function hexToRgba(hex: string): [number, number, number, number] {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return [(c >> 16) & 255, (c >> 8) & 255, c & 255, 255];
    }
    return [0, 0, 0, 255];
}

export function floodFill(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    fillColorHex: string
) {
    const canvas = ctx.canvas;
    const w = canvas.width;
    const h = canvas.height;

    // Get image data
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;

    const [r, g, b, a] = hexToRgba(fillColorHex);

    // Get target color
    const startPos = (startY * w + startX) * 4;
    const targetR = data[startPos];
    const targetG = data[startPos + 1];
    const targetB = data[startPos + 2];
    const targetA = data[startPos + 3];

    if (
        targetR === r &&
        targetG === g &&
        targetB === b &&
        targetA === a
    ) {
        return;
    }

    const matchColor = (pos: number) => {
        return (
            data[pos] === targetR &&
            data[pos + 1] === targetG &&
            data[pos + 2] === targetB &&
            data[pos + 3] === targetA
        );
    };

    const colorPixel = (pos: number) => {
        data[pos] = r;
        data[pos + 1] = g;
        data[pos + 2] = b;
        data[pos + 3] = a;
    };

    const stack: [number, number][] = [[startX, startY]];

    while (stack.length > 0) {
        const [cx, cy] = stack.pop()!;
        let currentPos = (cy * w + cx) * 4;

        // Go up as long as color matches
        let y1 = cy;
        while (y1 >= 0 && matchColor((y1 * w + cx) * 4)) {
            y1--;
        }
        y1++; // restore to last valid pixel

        // Go down and color
        let spanLeft = false;
        let spanRight = false;

        while (y1 < h && matchColor((y1 * w + cx) * 4)) {
            const pos = (y1 * w + cx) * 4;
            colorPixel(pos);

            if (cx > 0) {
                if (matchColor(pos - 4)) {
                    if (!spanLeft) {
                        stack.push([cx - 1, y1]);
                        spanLeft = true;
                    }
                } else if (spanLeft) {
                    spanLeft = false;
                }
            }

            if (cx < w - 1) {
                if (matchColor(pos + 4)) {
                    if (!spanRight) {
                        stack.push([cx + 1, y1]);
                        spanRight = true;
                    }
                } else if (spanRight) {
                    spanRight = false;
                }
            }

            y1++;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}
