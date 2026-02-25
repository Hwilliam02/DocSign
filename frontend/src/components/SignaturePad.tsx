import React, { useRef } from "react";
import { Button } from "./ui/button";

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);

  const start = (e: React.MouseEvent) => {
    drawing.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#1a1f36";
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const move = (e: React.MouseEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const end = () => {
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const save = () => {
    const data = canvasRef.current!.toDataURL("image/png");
    onSave(data);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={200} 
        className="border border-border rounded-md cursor-crosshair bg-white"
        style={{ touchAction: "none" }}
        onMouseDown={start} 
        onMouseMove={move} 
        onMouseUp={end} 
        onMouseLeave={end} 
      />
      <div className="flex gap-2 w-full justify-end max-w-[500px]">
        <Button variant="outline" onClick={clear}>Clear</Button>
        <Button onClick={save}>Save</Button>
      </div>
    </div>
  );
};

export default SignaturePad;
