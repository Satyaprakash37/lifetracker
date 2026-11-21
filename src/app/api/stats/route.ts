import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const stats = await prisma.gameStats.findUnique({
      where: { id: 'default' },
    });
    return NextResponse.json(stats || { xp: 690, level: 4, streak: 7 });
  } catch (error) {
    return NextResponse.json({ xp: 690, level: 4, streak: 7 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const stats = await prisma.gameStats.upsert({
      where: { id: 'default' },
      update: {
        xp: body.xp,
        level: body.level,
        streak: body.streak,
      },
      create: {
        id: 'default',
        xp: body.xp || 0,
        level: body.level || 1,
        streak: body.streak || 0,
      },
    });
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ success: true, localOnly: true });
  }
}

