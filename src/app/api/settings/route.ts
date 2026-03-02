import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { currentPassword, currentSecurityWord, newPassword, newSecurityWord, newUsername } =
      await req.json();

    if (!currentPassword || !currentSecurityWord) {
      return NextResponse.json(
        { error: "Debes ingresar tus credenciales actuales" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const passwordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    const securityValid = await bcrypt.compare(currentSecurityWord, user.securityWord);

    if (!passwordValid || !securityValid) {
      return NextResponse.json(
        { error: "Credenciales actuales incorrectas" },
        { status: 401 }
      );
    }

    const updateData: Record<string, string> = {};

    if (newUsername && newUsername !== user.username) {
      const existing = await prisma.user.findUnique({ where: { username: newUsername } });
      if (existing) {
        return NextResponse.json(
          { error: "El nombre de usuario ya está en uso" },
          { status: 409 }
        );
      }
      updateData.username = newUsername;
    }

    if (newPassword) {
      updateData.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    if (newSecurityWord) {
      updateData.securityWord = await bcrypt.hash(newSecurityWord, 12);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No hay cambios para aplicar" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
    });

    return NextResponse.json({ success: true, message: "Credenciales actualizadas" });
  } catch {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
