import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_HABITS } from '@/lib/initialData';

export async function GET() {
  try {
    const habits = await prisma.habit.findMany({
      orderBy: { order: 'asc' },
    });
    if (habits.length === 0) {
      return NextResponse.json(DEFAULT_HABITS);
    }
    return NextResponse.json(habits);
  } catch (error) {
    // If DB is not yet migrated, return default habits safely
    return NextResponse.json(DEFAULT_HABITS);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const habit = await prisma.habit.create({
      data: {
        id: body.id,
        title: body.title,
        category: body.category || 'General',
        icon: body.icon || '⭐',
        color: body.color || '#6366f1',
        order: body.order || 0,
      },
    });
    return NextResponse.json(habit);
  } catch (error) {
    return NextResponse.json({ success: true, localOnly: true });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing habit id' }, { status: 400 });

    await prisma.habit.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: true, localOnly: true });
  }
}

