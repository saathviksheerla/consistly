import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import Settings from '@/models/Settings';

const defaultSettings = { reminderTime: '18:00', streakFreezeUsed: false };

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  let userSettings = await Settings.findOne({ userId: session.user.id });

  if (!userSettings) {
    // Create default settings if they don't exist
    userSettings = await Settings.create({
      userId: session.user.id,
      ...defaultSettings,
    });
  }

  const obj = userSettings.toObject();
  obj.id = obj._id.toString();
  delete obj._id;

  return NextResponse.json(obj);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    await connectToDatabase();

    const updated = await Settings.findOneAndUpdate(
      { userId: session.user.id },
      { $set: body },
      { new: true, upsert: true },
    );

    const obj = updated.toObject();
    obj.id = obj._id.toString();
    delete obj._id;

    return NextResponse.json(obj);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
