import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[hsl(var(--macaron-pink)/0.3)] to-[hsl(var(--macaron-blue)/0.3)]">
      <Card className="w-full max-w-md mx-4 border-4 border-white rounded-3xl shadow-xl">
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center gap-4 mb-6">
            <AlertCircle className="h-16 w-16 text-[hsl(var(--macaron-pink-dark))]" />
            <h1 className="text-3xl font-display font-bold text-foreground">找不到頁面</h1>
          </div>

          <p className="text-muted-foreground mb-6">
            哎呀！這個頁面好像走丟了...
          </p>

          <Link href={base + "/"}>
            <Button className="btn-macaron btn-purple w-full py-6 text-lg rounded-xl">
              回到首頁
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
