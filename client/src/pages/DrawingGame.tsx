import { useRef, useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { useSound } from "@/hooks/use-sound-context";
import { Eraser, Download, Trash2, Palette, Undo, Redo, PaintBucket, StickyNote, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { floodFill } from "@/utils/flood-fill";

const TEMPLATES = [
    {
        id: "star",
        name: "星星",
        icon: "⭐",
        draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
            ctx.beginPath();
            const cx = w / 2;
            const cy = h / 2;
            const outerRadius = Math.min(w, h) / 3;
            const innerRadius = outerRadius / 2.5; // Thicker star

            for (let i = 0; i < 5; i++) {
                ctx.lineTo(
                    cx + Math.cos((18 + i * 72) / 180 * Math.PI) * outerRadius,
                    cy - Math.sin((18 + i * 72) / 180 * Math.PI) * outerRadius
                );
                ctx.lineTo(
                    cx + Math.cos((54 + i * 72) / 180 * Math.PI) * innerRadius,
                    cy - Math.sin((54 + i * 72) / 180 * Math.PI) * innerRadius
                );
            }
            ctx.closePath();
            ctx.lineWidth = 8;
            ctx.strokeStyle = "black";
            ctx.stroke();
            ctx.fillStyle = "white"; // Provide base for filling
            ctx.fill();
            ctx.stroke(); // Stroke again to be on top
        }
    },
    {
        id: "flower",
        name: "小花",
        icon: "🌸",
        draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
            const cx = w / 2;
            const cy = h / 2;
            const radius = Math.min(w, h) / 6;

            ctx.lineWidth = 6;
            ctx.strokeStyle = "black";
            ctx.fillStyle = "white";

            // Petals
            for (let i = 0; i < 6; i++) {
                const angle = (i * 60) * Math.PI / 180;
                const px = cx + Math.cos(angle) * radius * 1.5;
                const py = cy + Math.sin(angle) * radius * 1.5;

                ctx.beginPath();
                ctx.arc(px, py, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }

            // Center
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    },
    {
        id: "car",
        name: "車車",
        icon: "🚗",
        draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
            const cx = w / 2;
            const cy = h / 2;
            const scale = Math.min(w, h) / 400;

            ctx.save();
            ctx.translate(cx - 150 * scale, cy - 50 * scale);
            ctx.scale(scale, scale);

            ctx.lineWidth = 8;
            ctx.strokeStyle = "black";
            ctx.fillStyle = "white";

            // Body
            ctx.beginPath();
            ctx.moveTo(0, 100);
            ctx.lineTo(300, 100); // bottom
            ctx.lineTo(300, 60);  // rear bumper
            ctx.lineTo(280, 40);  // trunk
            ctx.lineTo(220, 0);   // rear windshield
            ctx.lineTo(80, 0);    // roof
            ctx.lineTo(20, 40);   // front windshield
            ctx.lineTo(0, 60);    // hood
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Wheels
            const drawWheel = (wx: number, wy: number) => {
                ctx.beginPath();
                ctx.arc(wx, wy, 40, 0, Math.PI * 2);
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(wx, wy, 15, 0, Math.PI * 2);
                ctx.fillStyle = "black";
                ctx.fill();
            };

            drawWheel(60, 100);
            drawWheel(240, 100);

            ctx.restore();
        }
    }
];

export default function DrawingGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#FF6B6B");
    const [brushSize, setBrushSize] = useState([10]);
    const [tool, setTool] = useState<"brush" | "eraser" | "bucket">("brush");
    const { playClick } = useSound();

    // Color palette
    const colors = [
        "#FF6B6B", "#FFB86C", "#FAD790", "#A0E7E5",
        "#8BE4F2", "#B9BCF2", "#F6A0F6", "#888888", "#000000"
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                // Save current content if needed, but for simplicity we might clear
                // or we can use a temp canvas to restore.
                // For now, let's just resize.
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
            }
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { x, y } = getCoordinates(e, canvas);

        if (tool === "bucket") {
            playClick();
            // Flood fill uses integer coordinates
            floodFill(ctx, Math.floor(x), Math.floor(y), color);
            return;
        }

        setIsDrawing(true);
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || tool === "bucket") return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { x, y } = getCoordinates(e, canvas);

        ctx.lineWidth = brushSize[0];
        ctx.strokeStyle = tool === "eraser" ? "#fffdf0" : color; // Erase to paper color

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        ctx?.beginPath();
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear logic for our paper background is actually just clearing 
        // because the CSS background is behind the canvas.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        playClick();
    };

    const loadTemplate = (template: typeof TEMPLATES[0]) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        clearCanvas();
        template.draw(ctx, canvas.width, canvas.height);
        playClick();
    };

    const saveImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Create a temporary canvas to composite the background + drawing
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tCtx = tempCanvas.getContext("2d");
        if (!tCtx) return;

        // Fill background
        tCtx.fillStyle = "#fffdf0";
        tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw main canvas
        tCtx.drawImage(canvas, 0, 0);

        const link = document.createElement('a');
        link.download = 'my-art.png';
        link.href = tempCanvas.toDataURL();
        link.click();
        playClick();
    };

    return (
        <Layout>
            <GameShell
                title="創意畫畫板"
                score={0}
                totalQuestions={0}
                currentQuestionIndex={0}
                gameType="drawing"
                isGameOver={false}
                onRestart={() => { }}
                colorClass="bg-gradient-to-br from-pink-400 to-purple-500 text-white"
            >
                <div className="flex flex-col gap-4 h-full w-full max-w-5xl mx-auto">
                    {/* Toolbar */}
                    <div className="bg-white/95 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] shadow-xl border-4 border-white/50 flex flex-col md:flex-row items-center gap-6 justify-between">

                        {/* Colors */}
                        <div className="flex gap-2 flex-wrap justify-center bg-gray-50/50 p-2 rounded-2xl max-w-[50%] md:max-w-none">
                            {colors.map((c) => (
                                <button
                                    key={c}
                                    className={`
                                        w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all duration-300 transform hover:scale-110
                                        ${color === c && tool !== 'eraser'
                                            ? 'border-gray-800 scale-110 shadow-lg ring-2 ring-white/50'
                                            : 'border-white shadow-md'
                                        }
                                    `}
                                    style={{ backgroundColor: c }}
                                    onClick={() => {
                                        setColor(c);
                                        if (tool === 'eraser') setTool("brush");
                                        playClick();
                                    }}
                                />
                            ))}
                        </div>

                        {/* Tools */}
                        <div className="flex items-center gap-4 flex-wrap justify-center">

                            {/* Brush/Bucket Toggle */}
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                <Button
                                    variant={tool === "brush" ? "default" : "ghost"}
                                    size="icon"
                                    onClick={() => setTool("brush")}
                                    className={`rounded-lg ${tool === 'brush' ? 'bg-pink-400 hover:bg-pink-500' : ''}`}
                                >
                                    <Palette className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant={tool === "bucket" ? "default" : "ghost"}
                                    size="icon"
                                    onClick={() => setTool("bucket")}
                                    className={`rounded-lg ${tool === 'bucket' ? 'bg-blue-400 hover:bg-blue-500' : ''}`}
                                >
                                    <PaintBucket className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Size Slider (Only needed for brush/eraser) */}
                            {tool !== 'bucket' && (
                                <div className="hidden md:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full w-32">
                                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                                    <Slider
                                        value={brushSize}
                                        onValueChange={setBrushSize}
                                        min={2}
                                        max={30}
                                        step={1}
                                    />
                                    <div className="w-5 h-5 rounded-full bg-gray-400" />
                                </div>
                            )}

                            <Button
                                variant={tool === "eraser" ? "default" : "outline"}
                                size="icon"
                                onClick={() => setTool("eraser")}
                                className={`rounded-xl ${tool === 'eraser' ? 'bg-gray-500 hover:bg-gray-600' : ''}`}
                            >
                                <Eraser className="w-5 h-5" />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={clearCanvas}
                                className="rounded-xl border-red-200 text-red-400 hover:bg-red-50"
                            >
                                <Trash2 className="w-5 h-5" />
                            </Button>

                            <Button
                                variant="default"
                                size="icon"
                                onClick={saveImage}
                                className="rounded-xl bg-green-500 hover:bg-green-600"
                            >
                                <Download className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Template Selector */}
                    <div className="flex gap-4 overflow-x-auto pb-2 px-2 snap-x">
                        <div className="flex items-center gap-2 bg-white/80 p-2 rounded-xl border-2 border-dashed border-purple-200 min-w-max">
                            <span className="text-sm font-bold text-purple-400 px-2">著色樣板：</span>
                            {TEMPLATES.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => loadTemplate(t)}
                                    className="flex flex-col items-center justify-center w-12 h-12 bg-white rounded-lg border-2 border-purple-100 hover:border-purple-400 hover:scale-105 transition-all shadow-sm group"
                                >
                                    <span className="text-xl group-hover:scale-110 transition-transform">{t.icon}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 bg-white p-2 rounded-[2.5rem] shadow-2xl border-8 border-[hsl(var(--macaron-yellow))] relative min-h-[400px]">
                        <div className="absolute inset-0 bg-[#fffdf0] rounded-[2rem] overflow-hidden cursor-crosshair m-2 border-2 border-dashed border-gray-200"
                            style={{ backgroundImage: 'radial-gradient(#ddd 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                        >
                            <canvas
                                ref={canvasRef}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                                className="absolute top-0 left-0 w-full h-full touch-none"
                            />
                        </div>
                    </div>
                </div>
            </GameShell>
        </Layout>
    );
}
