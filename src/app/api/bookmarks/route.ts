import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import Bookmark from '@/models/Bookmark';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const bookmarks = await Bookmark.find({ userId: session.user.id }).sort({ createdAt: -1 });

  const mapped = bookmarks.map((b) => {
    const obj = b.toObject();
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

    const newBookmark = await Bookmark.create({
      ...body,
      userId: session.user.id,
      isPinned: false,
    });

    const obj = newBookmark.toObject();
    obj.id = obj._id.toString();
    delete obj._id;

    return NextResponse.json(obj);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
