import { useRef, useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { useSound } from "@/hooks/use-sound-context";
import { Eraser, Download, Trash2, Palette, Undo, Redo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function DrawingGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#FF6B6B"); // Default macaron red
    const [brushSize, setBrushSize] = useState([5]);
    const [tool, setTool] = useState<"brush" | "eraser">("brush");
    const { playClick, playHover } = useSound();

    // Color palette
    const colors = [
        "#FF6B6B", // Red
        "#FFB86C", // Orange
        "#FAD790", // Yellow
        "#A0E7E5", // Teal
        "#8BE4F2", // Blue
        "#B9BCF2", // Purple
        "#F6A0F6", // Pink
        "#000000", // Black
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set initial canvas size
        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
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

        setIsDrawing(true);
        const { x, y } = getCoordinates(e, canvas);
        ctx.beginPath();
        ctx.moveTo(x, y);
        playClick(); // Play sound on start
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { x, y } = getCoordinates(e, canvas);

        ctx.lineWidth = brushSize[0];
        ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx?.beginPath(); // Reset path to prevent connecting new lines to old ones
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        playClick();
    };

    const saveImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Create a temporary link
        const link = document.createElement('a');
        link.download = 'my-masterpiece.png';
        link.href = canvas.toDataURL();
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
                gameType="math" // Placeholder, doesn't matter for this tool
                isGameOver={false}
                onRestart={() => { }}
                colorClass="bg-gradient-to-br from-pink-400 to-purple-500 text-white"
            >
                <div className="flex flex-col gap-4 h-full w-full max-w-5xl mx-auto">
                    {/* Toolbar */}
                    <div className="bg-white/95 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] shadow-xl border-4 border-white/50 flex flex-col md:flex-row items-center gap-6 justify-between transform hover:scale-[1.01] transition-transform">

                        {/* Colors - Paint Blobs */}
                        <div className="flex gap-3 flex-wrap justify-center bg-gray-50/50 p-3 rounded-2xl">
                            {colors.map((c) => (
                                <button
                                    key={c}
                                    className={`
                                        w-10 h-10 md:w-12 md:h-12 rounded-full border-4 transition-all duration-300 transform hover:scale-110
                                        ${color === c && tool === 'brush'
                                            ? 'border-gray-800 scale-110 shadow-lg ring-4 ring-white/50'
                                            : 'border-white shadow-md hover:shadow-lg'
                                        }
                                    `}
                                    style={{ backgroundColor: c }}
                                    onClick={() => {
                                        setColor(c);
                                        setTool("brush");
                                        playClick();
                                    }}
                                    aria-label={`Select color ${c}`}
                                />
                            ))}
                        </div>

                        {/* Tools - Big Colorful Buttons */}
                        <div className="flex items-center gap-6">

                            {/* Size Slider */}
                            <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full border-2 border-blue-100">
                                <div className="w-4 h-4 rounded-full bg-gray-400" />
                                <Slider
                                    value={brushSize}
                                    onValueChange={setBrushSize}
                                    min={2}
                                    max={30}
                                    step={1}
                                    className="w-24 md:w-32"
                                />
                                <div className="w-8 h-8 rounded-full bg-gray-400" />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant={tool === "eraser" ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => {
                                        setTool("eraser");
                                        playClick();
                                    }}
                                    className={`
                                        w-14 h-14 rounded-2xl border-b-4 active:border-b-0 active:translate-y-1 transition-all
                                        ${tool === "eraser"
                                            ? "bg-pink-400 hover:bg-pink-500 border-pink-700 text-white"
                                            : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50"
                                        }
                                    `}
                                    title="橡皮擦"
                                >
                                    <Eraser className="w-8 h-8" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={clearCanvas}
                                    className="w-14 h-14 rounded-2xl border-b-4 border-red-200 bg-red-50 text-red-400 hover:bg-red-100 hover:border-red-300 hover:text-red-500 active:border-b-0 active:translate-y-1 transition-all"
                                    title="清除全部"
                                >
                                    <Trash2 className="w-8 h-8" />
                                </Button>

                                <Button
                                    variant="default"
                                    size="icon"
                                    onClick={saveImage}
                                    className="w-14 h-14 rounded-2xl border-b-4 border-green-600 bg-green-400 hover:bg-green-500 text-white active:border-b-0 active:translate-y-1 transition-all shadow-lg shadow-green-200"
                                    title="下載作品"
                                >
                                    <Download className="w-8 h-8" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Canvas Area - Sketchbook Look */}
                    <div className="flex-1 bg-white p-2 rounded-[2.5rem] shadow-2xl border-8 border-[hsl(var(--macaron-yellow))] relative min-h-[500px]">
                        {/* Paper Texture Effect */}
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

                        {/* Decorative Clips */}
                        <div className="absolute -top-4 right-1/4 w-4 h-12 bg-gray-300 rounded-full shadow-md border-2 border-white transform rotate-6" />
                        <div className="absolute -top-4 left-1/4 w-4 h-12 bg-gray-300 rounded-full shadow-md border-2 border-white transform -rotate-3" />
                    </div>
                </div>
            </GameShell>
        </Layout>
    );
}
