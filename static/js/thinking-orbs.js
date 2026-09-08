/**
 * Thinking Orbs - Thought-orb loading indicators for AI interfaces
 * Adapted for Vanilla JS & Canvas with 9 hand-tuned animated states and custom brand color support.
 * States: "working" | "searching" | "solving" | "listening" | "connecting" | "weaving" | "composing" | "breathing" | "shaping"
 */
(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        global.ThinkingOrb = factory();
    }
})(typeof window !== 'undefined' ? window : this, function () {
    'use strict';

    // Math & Geometry Helpers
    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function fract(n) {
        return n - Math.floor(n);
    }

    function smoothNoise2D(x, y) {
        const iX = Math.floor(x), iY = Math.floor(y);
        let fX = x - iX, fY = y - iY;
        fX = fX * fX * (3 - 2 * fX);
        fY = fY * fY * (3 - 2 * fY);
        const s1 = hash2D(iX, iY), s2 = hash2D(iX + 1, iY);
        const s3 = hash2D(iX, iY + 1), s4 = hash2D(iX + 1, iY + 1);
        return s1 + (s2 - s1) * fX + (s3 - s1) * fY + (s1 - s2 - s3 + s4) * fX * fY;
    }

    function hash2D(x, y) {
        const t = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return t - Math.floor(t);
    }

    function fibonacciSpherePoint(index, total) {
        const phi = Math.PI * (3 - Math.sqrt(5));
        const y = 1 - 2 * (index + 0.5) / total;
        const radius = Math.sqrt(1 - y * y);
        const theta = index * phi;
        return [radius * Math.cos(theta), y, radius * Math.sin(theta)];
    }

    function angleDiff(a, b) {
        return Math.atan2(Math.sin(a - b), Math.cos(a - b));
    }

    function makeProjection(yaw, pitch, cx, cy, scale) {
        const sinP = Math.sin(pitch), cosP = Math.cos(pitch);
        const sinY = Math.sin(yaw), cosY = Math.cos(yaw);
        return function (x, y, z) {
            const rotX = x * cosY + z * sinY;
            const rotZ = -x * sinY + z * cosY;
            const projY = y * cosP - rotZ * sinP;
            const depth = y * sinP + rotZ * cosP;
            return [cx + rotX * scale, cy - projY * scale, depth];
        };
    }

    function radiusScale(size, pow) {
        return Math.pow(size / 300, pow);
    }

    function finalizeFrame(dots, lines, minRadius = 0.3) {
        const filteredDots = [];
        for (let i = 0; i < dots.length; i++) {
            const d = dots[i];
            const alpha = d.a !== undefined ? d.a : 1;
            if (alpha >= 0.02) {
                d.r = Math.max(minRadius, d.r);
                filteredDots.push(d);
            }
        }
        filteredDots.sort((a, b) => a.z - b.z);
        const filteredLines = lines.filter(l => (l.a !== undefined ? l.a : 1) >= 0.02);
        return { dots: filteredDots, lines: filteredLines };
    }

    // Color Parser & Tinting
    function parseColor(color) {
        if (!color) return null;
        if (typeof color === 'object' && color.r !== undefined) return color;
        if (typeof color === 'string') {
            if (color.startsWith('#')) {
                let hex = color.slice(1);
                if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
                const num = parseInt(hex, 16);
                return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
            }
            const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
            if (rgbMatch) {
                return { r: parseInt(rgbMatch[1]), g: parseInt(rgbMatch[2]), b: parseInt(rgbMatch[3]) };
            }
        }
        return null;
    }

    function paintFrame(ctx, frame, dark = true, customColor = null) {
        const parsedCol = parseColor(customColor);
        const { dots, lines } = frame;

        // Draw lines if any
        if (lines && lines.length > 0) {
            for (let i = 0; i < lines.length; i++) {
                const l = lines[i];
                const alpha = l.a !== undefined ? l.a : 1;
                const white = Math.min(1, Math.max(0, l.white !== undefined ? l.white : 0.5));
                const lum = Math.round((dark ? 1 - white : white) * 255);

                if (parsedCol) {
                    const r = Math.round(lerp(parsedCol.r, lum, 0.4));
                    const g = Math.round(lerp(parsedCol.g, lum, 0.4));
                    const b = Math.round(lerp(parsedCol.b, lum, 0.4));
                    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.85})`;
                } else {
                    ctx.strokeStyle = `rgba(${lum},${lum},${lum},${alpha})`;
                }
                ctx.lineWidth = l.w || 1;
                ctx.beginPath();
                ctx.moveTo(l.x1, l.y1);
                ctx.lineTo(l.x2, l.y2);
                ctx.stroke();
            }
        }

        // Draw dots
        for (let i = 0; i < dots.length; i++) {
            const d = dots[i];
            const alpha = d.a !== undefined ? d.a : 1;
            const white = Math.min(1, Math.max(0, d.white !== undefined ? d.white : 0.5));
            const lum = Math.round((dark ? 1 - white : white) * 255);

            if (parsedCol) {
                const mix = Math.min(1, white * 0.6);
                const r = Math.round(lerp(parsedCol.r, 255, mix));
                const g = Math.round(lerp(parsedCol.g, 255, mix));
                const b = Math.round(lerp(parsedCol.b, 255, mix));
                ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
            } else {
                ctx.fillStyle = `rgba(${lum},${lum},${lum},${alpha})`;
            }

            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 9 Mode Generators
    // 1. Orbits (working)
    function generateOrbits(size, time, opts) {
        const cx = size / 2, cy = size / 2, radius = size / 2 * 0.82;
        const proj = makeProjection(time * 0.12, 0.3, cx, cy, 1);
        const scale = radiusScale(size, opts.rsPow !== undefined ? opts.rsPow : 0.6);
        const dots = [];
        const orbitN = opts.orbitN !== undefined ? opts.orbitN : 12;
        const ghostN = opts.ghostN !== undefined ? opts.ghostN : 40;
        const particles = opts.particles !== undefined ? opts.particles : 3;

        for (let i = 0; i < orbitN; i++) {
            const h1 = hash2D(i, 1.7), h2 = hash2D(i, 5.2), h3 = hash2D(i, 8.9);
            const rOrbit = radius * (0.45 + 0.52 * h1);
            const yaw = h1 * 2 * Math.PI, pitch = (h2 - 0.5) * Math.PI * 0.8;
            let nx = Math.cos(yaw) * Math.cos(pitch), ny = Math.sin(pitch), nz = Math.sin(yaw) * Math.cos(pitch);
            let ux = -ny, uy = nx, uz = 0;
            const uLen = Math.max(1e-6, Math.sqrt(ux * ux + uy * uy));
            ux /= uLen; uy /= uLen;
            const vx = ny * uz - nz * uy, vy = nz * ux - nx * uz, vz = nx * uy - ny * ux;
            const speed = (0.25 + 0.55 * h3) * (h3 > 0.5 ? 1 : -1);

            for (let g = 0; g < ghostN; g++) {
                const angle = g / ghostN * 2 * Math.PI;
                const px = (ux * Math.cos(angle) + vx * Math.sin(angle)) * rOrbit;
                const py = (uy * Math.cos(angle) + vy * Math.sin(angle)) * rOrbit;
                const pz = (uz * Math.cos(angle) + vz * Math.sin(angle)) * rOrbit;
                const [sx, sy, sz] = proj(px, py, pz);
                const depth = (sz / radius + 1) / 2;
                dots.push({
                    x: sx, y: sy, z: sz,
                    r: ((opts.rBase || 0.4) + (opts.rDepth || 1.1) * depth) * scale,
                    white: 0.85 - 0.3 * depth,
                    a: (opts.ghostAlpha || 0.12) * (0.3 + 0.7 * depth)
                });
            }

            for (let p = 0; p < particles; p++) {
                const angle = time * speed + p / particles * 2 * Math.PI + h2 * 6;
                const px = (ux * Math.cos(angle) + vx * Math.sin(angle)) * rOrbit;
                const py = (uy * Math.cos(angle) + vy * Math.sin(angle)) * rOrbit;
                const pz = (uz * Math.cos(angle) + vz * Math.sin(angle)) * rOrbit;
                const [sx, sy, sz] = proj(px, py, pz);
                const depth = (sz / radius + 1) / 2;
                dots.push({
                    x: sx, y: sy, z: sz,
                    r: ((opts.rBase || 1.2) + (opts.rDepth || 2.2) * depth) * scale,
                    white: 0.45 - 0.4 * depth,
                    a: 0.4 + 0.6 * depth
                });
            }
        }
        return finalizeFrame(dots, [], opts.rMin);
    }

    // 2. Globe (searching)
    function generateGlobe(size, time, opts) {
        const cx = size / 2, cy = size / 2, radius = size / 2 * 0.82;
        const pitch = 0.4 + 0.06 * Math.sin(time * 0.35);
        const proj = makeProjection(time * 0.5, pitch, cx, cy, radius);
        const scanAngle = time * (0.5 + (1.7 - 0.5) * (opts.scanMul !== undefined ? opts.scanMul : 1));
        const scale = radiusScale(size, opts.rsPow !== undefined ? opts.rsPow : 0.6);
        const dimBase = opts.dimBase !== undefined ? opts.dimBase : 1;
        const dots = [];
        const latRings = opts.latRings || 17, lonDensity = opts.lonDensity || 44;

        for (let w = 0; w <= latRings; w++) {
            const phi = -Math.PI / 2 + w / latRings * Math.PI;
            const cosP = Math.cos(phi), sinP = Math.sin(phi);
            const numLon = Math.max(1, Math.round(Math.abs(cosP) * lonDensity));
            for (let f = 0; f < numLon; f++) {
                const theta = f / numLon * 2 * Math.PI;
                const [sx, sy, sz] = proj(cosP * Math.cos(theta), sinP, cosP * Math.sin(theta));
                const depth = (sz + 1) / 2;
                const diff = angleDiff(theta + time * 0.5, scanAngle);
                const scanHighlight = Math.exp(-(diff * diff) / 0.18) * Math.max(0, sz);
                dots.push({
                    x: sx, y: sy, z: sz,
                    r: ((opts.rBase || 0.6) + (opts.rDepth || 1.7) * depth + (opts.rBoost || 1) * scanHighlight) * scale,
                    white: (opts.inkFar || 0.62) - (opts.inkSpan || 0.54) * depth,
                    a: dimBase + (1 - dimBase) * Math.min(1, scanHighlight)
                });
            }
        }
        return finalizeFrame(dots, [], opts.rMin);
    }

    // 3. Rubik (solving)
    function getRubikRotation(time, count, stepTime, pauseTime) {
        const cycle = 2 * count * stepTime + pauseTime;
        const modTime = time % cycle;
        const amounts = new Array(count).fill(0);
        let activeIdx = -1;
        if (modTime < 2 * count * stepTime) {
            const step = Math.floor(modTime / stepTime);
            const tInStep = (modTime - step * stepTime) / stepTime;
            const ease = 1 - Math.pow(1 - Math.min(1, tInStep / 0.7), 3);
            if (step < count) {
                for (let e = 0; e < step; e++) amounts[e] = 1;
                amounts[step] = ease;
                activeIdx = step;
            } else {
                const revStep = 2 * count - 1 - step;
                for (let l = 0; l < revStep; l++) amounts[l] = 1;
                amounts[revStep] = 1 - ease;
                activeIdx = revStep;
            }
        }
        return { amount: amounts, active: activeIdx };
    }

    function rotateRubikPoint(pt, moves, rotState) {
        let [x, y, z] = pt;
        let isActive = false;
        for (let i = 0; i < moves.length; i++) {
            if (rotState.amount[i] <= 0) continue;
            const move = moves[i];
            const coord = move.axis === 0 ? x : move.axis === 1 ? y : z;
            if (coord < move.lo || coord >= move.hi) continue;
            if (i === rotState.active) isActive = true;
            const ang = move.ang * rotState.amount[i];
            const cosA = Math.cos(ang), sinA = Math.sin(ang);
            if (move.axis === 0) {
                const ny = y * cosA - z * sinA;
                z = y * sinA + z * cosA;
                y = ny;
            } else if (move.axis === 1) {
                const nx = x * cosA + z * sinA;
                z = -x * sinA + z * cosA;
                x = nx;
            } else {
                const nx = x * cosA - y * sinA;
                y = x * sinA + y * cosA;
                x = nx;
            }
        }
        return [x, y, z, isActive];
    }

    function createRubikMoves(count) {
        const moves = [];
        for (let i = 0; i < count; i++) {
            const axis = Math.min(2, Math.floor(hash2D(i, 2.3) * 3));
            const lo = -1 + 0.5 * Math.min(3, Math.floor(hash2D(i, 5.9) * 4));
            const sign = hash2D(i, 7.7) < 0.5 ? 1 : -1;
            moves.push({ axis, lo, hi: lo + 0.5, ang: sign * Math.PI / 2 });
        }
        return moves;
    }

    function generateRubik(size, time, opts) {
        const cx = size / 2, cy = size / 2, radius = size / 2 * 0.82;
        const proj = makeProjection(time * 0.55, 0.35 + 0.1 * Math.sin(time * 0.9), cx, cy, radius);
        const scale = radiusScale(size, opts.rsPow !== undefined ? opts.rsPow : 0.6);
        const moveCount = opts.moveCount || 14;
        const moves = createRubikMoves(moveCount);
        const rotState = getRubikRotation(time, moveCount, 0.42, 1.2);
        const dots = [];
        const latRings = opts.latRings || 15, lonDensity = opts.lonDensity || 40;

        for (let w = 0; w <= latRings; w++) {
            const phi = -Math.PI / 2 + w / latRings * Math.PI;
            const cosP = Math.cos(phi), sinP = Math.sin(phi);
            const numLon = Math.max(1, Math.round(Math.abs(cosP) * lonDensity));
            for (let b = 0; b < numLon; b++) {
                const theta = b / numLon * 2 * Math.PI;
                const [rx, ry, rz, isActive] = rotateRubikPoint([cosP * Math.cos(theta), sinP, cosP * Math.sin(theta)], moves, rotState);
                const [sx, sy, sz] = proj(rx, ry, rz);
                const depth = (sz + 1) / 2;
                dots.push({
                    x: sx, y: sy, z: sz,
                    r: ((opts.rBase || 0.6) + (opts.rDepth || 1.7) * depth + (isActive ? (opts.rActive || 0.3) : 0)) * scale,
                    white: (opts.inkFar || 0.62) - (opts.inkSpan || 0.54) * depth - (isActive ? 0.14 : 0)
                });
            }
        }
        return finalizeFrame(dots, [], opts.rMin);
    }

    // 4. Wave (listening)
    function generateWave(size, time, opts) {
        const cx = size / 2, cy = size / 2, radius = size / 2 * 0.874;
        const proj = makeProjection(time * 0.18, 0.38, cx, cy, 1);
        const scale = radiusScale(size, opts.rsPow !== undefined ? opts.rsPow : 0.6);
        const dots = [];
        const rings = opts.rings || 15, lonDensity = opts.lonDensity || 38;

        for (let p = 0; p <= rings; p++) {
            const phi = -Math.PI / 2 + p / rings * Math.PI;
            const cosP = Math.cos(phi), sinP = Math.sin(phi);
            const wave = 0.62 * Math.sin(time * 2.2 + phi * 3.5);
            const rMod = radius * (1 + 0.14 * wave);
            const numLon = Math.max(1, Math.round(Math.abs(cosP) * lonDensity));
            for (let y = 0; y < numLon; y++) {
                const theta = y / numLon * 2 * Math.PI;
                const [sx, sy, sz] = proj(cosP * Math.cos(theta) * rMod, sinP * rMod, cosP * Math.sin(theta) * rMod);
                const depth = (sz / radius + 1) / 2;
                dots.push({
                    x: sx, y: sy, z: sz,
                    r: ((opts.rBase || 0.7) + (opts.rDepth || 1.6) * depth) * scale,
                    white: 0.7 - 0.45 * depth,
                    a: 0.3 + 0.7 * depth
                });
            }
        }
        return finalizeFrame(dots, [], opts.rMin);
    }

    // 5. Web (connecting)
    function generateWeb(size, time, opts) {
        const cx = size / 2, cy = size / 2, radius = size / 2 * 0.8;
        const proj = makeProjection(time * 0.25, 0.32, cx, cy, radius);
        const scale = radiusScale(size, opts.rsPow !== undefined ? opts.rsPow : 0.6);
        const nodeCount = opts.nodeN || 22;
        const nodes = [];
        const dots = [], lines = [];

        for (let i = 0; i < nodeCount; i++) {
            const base = fibonacciSpherePoint(i, nodeCount);
            const noiseX = smoothNoise2D(i * 0.31 + 9, time * 0.24) - 0.5;
            const noiseY = smoothNoise2D(i * 0.31 + 45, time * 0.24) - 0.5;
            const noiseZ = smoothNoise2D(i * 0.31 + 83, time * 0.24) - 0.5;
            const px = base[0] + 0.3 * noiseX * 2;
            const py = base[1] + 0.3 * noiseY * 2;
            const pz = base[2] + 0.3 * noiseZ * 2;
            const len = Math.sqrt(px * px + py * py + pz * pz) || 1;
            const [sx, sy, sz] = proj(px / len, py / len, pz / len);
            const depth = (sz + 1) / 2;
            nodes.push({ x: sx, y: sy, z: sz, depth });
            dots.push({
                x: sx, y: sy, z: sz,
                r: ((opts.rBase || 1.4) + (opts.rDepth || 2.0) * depth) * scale,
                white: 0.6 - 0.4 * depth,
                a: 0.5 + 0.5 * depth
            });
        }

        // Generate connecting lines between close nodes
        for (let i = 0; i < nodeCount; i++) {
            for (let j = i + 1; j < nodeCount; j++) {
                const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = size * 0.38;
                if (dist < maxDist) {
                    const lineAlpha = (1 - dist / maxDist) * 0.6;
                    lines.push({
                        x1: nodes[i].x, y1: nodes[i].y,
                        x2: nodes[j].x, y2: nodes[j].y,
                        w: 1 * scale,
                        white: 0.65,
                        a: lineAlpha
                    });
                }
            }
        }
        return finalizeFrame(dots, lines, opts.rMin);
    }

    // 6. Braid (weaving)
    function generateBraid(size, time, opts) {
        const cx = size / 2, cy = size / 2, radius = size / 2 * 0.76;
        const proj = makeProjection(time * 0.4, 0.3, cx, cy, 1);
        const scale = radiusScale(size, opts.rsPow !== undefined ? opts.rsPow : 0.6);
        const dots = [];
        const ghostN = opts.ghostN || 150;

        for (let e = 0; e < ghostN; e++) {
            const pt = fibonacciSpherePoint(e, ghostN);
            const [sx, sy, sz] = proj(pt[0] * radius, pt[1] * radius, pt[2] * radius);
            const depth = (sz / radius + 1) / 2;
            dots.push({ x: sx, y: sy, z: sz, r: 0.8 * scale, white: 0.78, a: 0.1 + 0.22 * depth });
        }

        const strandN = opts.strandN || 52, turns = opts.turns || 3;
        for (let s = 0; s < 3; s++) {
            const phase = s / 3 * 2 * Math.PI;
            for (let r = 0; r < strandN; r++) {
                const yNorm = (fract(r / strandN + time * 0.045) * 2 - 1) * 0.96;
                const rNorm = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
                const edgeFade = Math.min(1, (1 - Math.abs(yNorm)) / 0.1);
                const angle = yNorm * Math.PI * turns + phase;
                const wave = 1 + 0.075 * Math.sin(yNorm * Math.PI * turns * 2 + phase * 2 + time * 0.8);
                const rad = rNorm * radius * wave;
                const [sx, sy, sz] = proj(Math.cos(angle) * rad, yNorm * radius * wave, Math.sin(angle) * rad);
                const depth = (sz / radius + 1) / 2;
                dots.push({
                    x: sx, y: sy, z: sz,
                    r: ((opts.rBase || 1.2) + (opts.rDepth || 1.8) * depth) * scale,
                    white: 0.55 - 0.45 * depth,
                    a: edgeFade * (0.45 + 0.55 * depth)
                });
            }
        }
        return finalizeFrame(dots, [], opts.rMin);
    }

    // 7. Ribbon (composing) & 8. Ring (breathing)
    function generateRibbonOrRing(size, time, opts) {
        const cx = size / 2, cy = size / 2, radius = size / 2 * 0.78;
        const spin = opts.spin !== undefined ? opts.spin : 1;
        const proj = makeProjection(time * 0.1 * spin, 0.3, cx, cy, 1);
        const scale = radiusScale(size, opts.rsPow !== undefined ? opts.rsPow : 0.6);
        const dots = [];
        const lanes = opts.lanes || 7, segs = opts.segs || 50;

        for (let l = 0; l < lanes; l++) {
            const laneOffset = (l - (lanes - 1) / 2) * 0.08;
            for (let s = 0; s < segs; s++) {
                const theta = s / segs * 2 * Math.PI;
                const wave = 0.18 * Math.sin(theta * 3 - time * 1.7 + l * 0.22);
                const rad = radius * (0.75 + laneOffset + wave);
                const yPos = Math.sin(theta * 2 + time * 0.9) * radius * 0.35;
                const [sx, sy, sz] = proj(Math.cos(theta) * rad, yPos, Math.sin(theta) * rad);
                const depth = (sz / radius + 1) / 2;
                dots.push({
                    x: sx, y: sy, z: sz,
                    r: ((opts.rBase || 1.0) + (opts.rDepth || 1.8) * depth) * scale,
                    white: 0.6 - 0.45 * depth,
                    a: 0.4 + 0.6 * depth
                });
            }
        }
        return finalizeFrame(dots, [], opts.rMin);
    }

    // 9. Morph (shaping)
    function generateMorph(size, time, opts) {
        const cx = size / 2, cy = size / 2, radius = size / 2 * 0.75 * (opts.spread || 1);
        const proj = makeProjection(time * 0.3, 0.32, cx, cy, radius);
        const scale = radiusScale(size, opts.rsPow !== undefined ? opts.rsPow : 0.6);
        const dots = [];
        const count = opts.count || 24;

        for (let i = 0; i < count; i++) {
            const base = fibonacciSpherePoint(i, count);
            const morph = Math.sin(time * 1.5 + i * 0.5) * 0.25;
            const px = base[0] * (1 + morph);
            const py = base[1] * (1 + morph);
            const pz = base[2] * (1 + morph);
            const [sx, sy, sz] = proj(px, py, pz);
            const depth = (sz + 1) / 2;
            dots.push({
                x: sx, y: sy, z: sz,
                r: ((opts.rBase || 1.6) + (opts.rDepth || 2.4) * depth) * scale,
                white: 0.5 - 0.4 * depth,
                a: 0.5 + 0.5 * depth
            });
        }
        return finalizeFrame(dots, [], opts.rMin);
    }

    const MODE_FRAMES = {
        orbits: generateOrbits,
        globe: generateGlobe,
        rubik: generateRubik,
        wave: generateWave,
        web: generateWeb,
        braid: generateBraid,
        ribbon: generateRibbonOrRing,
        ring: generateRibbonOrRing,
        morph: generateMorph
    };

    const STATE_TO_MODE = {
        working: 'orbits',
        searching: 'globe',
        solving: 'rubik',
        listening: 'wave',
        connecting: 'web',
        weaving: 'braid',
        composing: 'ribbon',
        breathing: 'ring',
        shaping: 'morph'
    };

    const PRESETS = {
        orbits: { 64: { speed: 1.885, count: 1, size: 1 }, 20: { speed: 3.9, count: 0.238, size: 2.4 } },
        globe: { 64: { speed: 2.015, count: 0.42, size: 1.15 }, 20: { speed: 2.665, count: 0.105, size: 1.75 } },
        rubik: { 64: { speed: 1.82, count: 0.35, size: 1.05 }, 20: { speed: 1.95, count: 0.088, size: 1.9 } },
        wave: { 64: { speed: 1.69, count: 0.35, size: 1.05 }, 20: { speed: 2.21, count: 0.07, size: 2.0 } },
        web: { 64: { speed: 3.315, count: 1.35, size: 0.95 }, 20: { speed: 6.63, count: 0.25, size: 1.52 } },
        braid: { 64: { speed: 1.625, count: 0.5, size: 1 }, 20: { speed: 2.75, count: 0.1125, size: 1.36 } },
        ribbon: { 64: { speed: 2.34, count: 0.25, size: 0.85 }, 20: { speed: 3.12, count: 0.051, size: 1.073 } },
        ring: { 64: { speed: 3.24, count: 0.25, size: 0.956 }, 20: { speed: 3.78, count: 0.028, size: 1.622 } },
        morph: { 64: { speed: 2.405, count: 0.702, size: 0.395 }, 20: { speed: 2.08, count: 0.53, size: 1.011 } }
    };

    function resolvePreset(state, size) {
        const mode = STATE_TO_MODE[state] || 'globe';
        const presetTable = PRESETS[mode] || PRESETS.globe;
        const preset = size <= 32 ? presetTable[20] : presetTable[64];
        return {
            mode,
            speed: (preset && preset.speed) || 2.0,
            opts: { rMin: 0.3 }
        };
    }

    /**
     * ThinkingOrb Controller Class
     */
    class ThinkingOrb {
        constructor(options = {}) {
            this.state = options.state || 'searching';
            this.size = options.size || 64;
            this.speed = options.speed || 1.0;
            this.dark = options.dark !== undefined ? options.dark : true;
            this.color = options.color || '#00f0ff'; // Brand cyan
            this.paused = Boolean(options.paused);
            this.target = options.target || null;

            this.canvas = null;
            this.ctx = null;
            this.animId = null;
            this.lastTime = 0;
            this.time = 0;
            this.observer = null;
            this.isVisible = true;

            if (this.target) {
                this.mount(this.target);
            }
        }

        mount(target) {
            const container = typeof target === 'string' ? document.querySelector(target) : target;
            if (!container) return;

            this.canvas = document.createElement('canvas');
            this.canvas.className = 'thinking-orb-canvas';
            this.ctx = this.canvas.getContext('2d');
            this.updateCanvasSize();

            container.appendChild(this.canvas);

            // Intersection Observer to pause when offscreen
            if (typeof IntersectionObserver !== 'undefined') {
                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        this.isVisible = entry.isIntersecting;
                    });
                }, { threshold: 0.05 });
                this.observer.observe(this.canvas);
            }

            this.startAnimation();
        }

        updateCanvasSize() {
            if (!this.canvas) return;
            const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
            this.canvas.width = Math.round(this.size * dpr);
            this.canvas.height = Math.round(this.size * dpr);
            this.canvas.style.width = this.size + 'px';
            this.canvas.style.height = this.size + 'px';
            this.canvas.style.display = 'inline-block';
            this.canvas.style.verticalAlign = 'middle';
            if (this.ctx) {
                this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }
        }

        startAnimation() {
            if (this.animId) return;
            this.lastTime = (typeof performance !== 'undefined' ? performance.now() : Date.now());

            const renderLoop = (now) => {
                const dt = Math.min(0.1, (now - this.lastTime) / 1000);
                this.lastTime = now;

                if (!this.paused && this.isVisible && (typeof document === 'undefined' || document.visibilityState !== 'hidden')) {
                    const preset = resolvePreset(this.state, this.size);
                    const speedMultiplier = (preset.speed || 2.0) * this.speed;
                    this.time += dt * speedMultiplier;

                    if (this.ctx) {
                        this.ctx.clearRect(0, 0, this.size, this.size);
                        const generator = MODE_FRAMES[preset.mode] || MODE_FRAMES.globe;
                        const frame = generator(this.size, this.time, preset.opts);
                        paintFrame(this.ctx, frame, this.dark, this.color);
                    }
                }

                if (typeof requestAnimationFrame !== 'undefined') {
                    this.animId = requestAnimationFrame(renderLoop);
                }
            };

            if (typeof requestAnimationFrame !== 'undefined') {
                this.animId = requestAnimationFrame(renderLoop);
            }
        }

        setState(newState) {
            if (STATE_TO_MODE[newState]) {
                this.state = newState;
            }
        }

        setSize(newSize) {
            this.size = newSize;
            this.updateCanvasSize();
        }

        setColor(newColor) {
            this.color = newColor;
        }

        pause() {
            this.paused = true;
        }

        play() {
            this.paused = false;
        }

        destroy() {
            if (this.animId && typeof cancelAnimationFrame !== 'undefined') {
                cancelAnimationFrame(this.animId);
                this.animId = null;
            }
            if (this.observer && this.canvas) {
                this.observer.unobserve(this.canvas);
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
            this.canvas = null;
            this.ctx = null;
        }

        static create(options = {}) {
            return new ThinkingOrb(options);
        }
    }

    
    // Custom Element <thinking-orb> support for declarative usage across HTML, React, and Vue
    if (typeof customElements !== 'undefined' && !customElements.get('thinking-orb')) {
        class ThinkingOrbElement extends HTMLElement {
            static get observedAttributes() {
                return ['state', 'size', 'speed', 'color', 'dark', 'paused'];
            }

            connectedCallback() {
                const state = this.getAttribute('state') || 'searching';
                const size = parseInt(this.getAttribute('size') || '64', 10);
                const speed = parseFloat(this.getAttribute('speed') || '1.0');
                const color = this.getAttribute('color') || '#00f0ff';
                const dark = this.getAttribute('dark') !== 'false';
                const paused = this.hasAttribute('paused');

                this.style.display = 'inline-flex';
                this.style.alignItems = 'center';
                this.style.justifyContent = 'center';

                this.orb = new ThinkingOrb({
                    target: this,
                    state,
                    size,
                    speed,
                    color,
                    dark,
                    paused
                });
            }

            disconnectedCallback() {
                if (this.orb) {
                    this.orb.destroy();
                    this.orb = null;
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (!this.orb || oldValue === newValue) return;
                if (name === 'state') this.orb.setState(newValue);
                if (name === 'size') this.orb.setSize(parseInt(newValue, 10));
                if (name === 'speed') this.orb.speed = parseFloat(newValue);
                if (name === 'color') this.orb.setColor(newValue);
                if (name === 'paused') {
                    if (newValue !== null && newValue !== 'false') {
                        this.orb.pause();
                    } else {
                        this.orb.play();
                    }
                }
            }
        }

        customElements.define('thinking-orb', ThinkingOrbElement);
    }

    ThinkingOrb.MODES = MODE_FRAMES;
    ThinkingOrb.STATE_TO_MODE = STATE_TO_MODE;
    return ThinkingOrb;
});
