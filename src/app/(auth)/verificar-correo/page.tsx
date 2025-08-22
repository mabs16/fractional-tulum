import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function VerificarCorreoPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">¡Casi listo! Revisa tu correo</CardTitle>
          <CardDescription>
            Hemos enviado un enlace de confirmación a tu bandeja de entrada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            Por favor, haz clic en el enlace que te hemos enviado para activar tu cuenta. Si no lo encuentras, revisa tu carpeta de spam.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}