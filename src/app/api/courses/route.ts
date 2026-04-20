import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import Course from '@/models/Course';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const courses = await Course.find({ userId: session.user.id }).sort({ createdAt: -1 });

  // Transform _id to id for frontend compatibility
  const mapped = courses.map((c) => {
    const obj = c.toObject();
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

    const newCourse = await Course.create({
      ...body,
      userId: session.user.id,
      completedLessons: 0,
    });

    const obj = newCourse.toObject();
    obj.id = obj._id.toString();
    delete obj._id;

    return NextResponse.json(obj);
  } catch (error) {
    console.error('Failed to create course', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
