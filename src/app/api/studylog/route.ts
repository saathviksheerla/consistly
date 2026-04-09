import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import StudyLog from '@/models/StudyLog';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const logs = await StudyLog.find({ userId: session.user.id }).sort({ date: 1 });

  const mapped = logs.map((l) => {
    const obj = l.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    return obj;
  });

  return NextResponse.json(mapped);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    await connectToDatabase();

    const newLog = await StudyLog.create({
      ...body,
      userId: session.user.id,
      date: body.date || new Date().toISOString().split('T')[0],
    });

    const obj = newLog.toObject();
    obj.id = obj._id.toString();
    delete obj._id;

    return NextResponse.json(obj);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
