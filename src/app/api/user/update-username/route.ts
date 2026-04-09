import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { clientPromise } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
    }

    const newName = name.trim();

    if (newName.length > 30) {
      return NextResponse.json(
        { error: 'Username must be 30 characters or less' },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Fetch current user data from DB directly to ensure we have the latest lastUsernameUpdate
    const user = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();

    if (user.lastUsernameUpdate) {
      const lastUpdate = new Date(user.lastUsernameUpdate);
      const ninetyDaysAgo = new Date(now);
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      if (lastUpdate > ninetyDaysAgo) {
        const daysLeft = Math.ceil(
          (lastUpdate.getTime() - ninetyDaysAgo.getTime()) / (1000 * 60 * 60 * 24),
        );
        return NextResponse.json(
          { error: `You can update your username again in ${daysLeft} days.` },
          { status: 403 },
        );
      }
    }

    // Update the user
    await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          name: newName,
          lastUsernameUpdate: now.toISOString(),
        },
      },
    );

    return NextResponse.json({ success: true, name: newName });
  } catch (error) {
    console.error('Error updating username:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
