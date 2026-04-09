import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import Milestone from '@/models/Milestone';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const milestones = await Milestone.find({ userId: session.user.id }).sort({ targetDate: 1 });

  const mapped = milestones.map((m) => {
    const obj = m.toObject();
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

    const newMilestone = await Milestone.create({
      ...body,
      userId: session.user.id,
      status: 'Not Started',
    });

    const obj = newMilestone.toObject();
    obj.id = obj._id.toString();
    delete obj._id;

    return NextResponse.json(obj);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
