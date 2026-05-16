import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/services/settings.service";
import { settingsSchema } from "@/lib/validations/settings.schema";
import { ZodError } from "zod";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "No se encontraron configuraciones" }, { status: 404 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = settingsSchema.parse(body);
    const updated = await saveSettings(validated);
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: err.errors }, { status: 422 });
    }
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
