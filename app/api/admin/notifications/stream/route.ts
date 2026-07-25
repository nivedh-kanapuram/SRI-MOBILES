import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let active = true;
  req.signal.addEventListener('abort', () => { active = false; });

  const stream = new ReadableStream({
    async start(controller) {
      const poll = async () => {
        while (active) {
          try {
            const notifications = await prisma.pendingNotification.findMany({
              where: { delivered: false },
              orderBy: { createdAt: 'asc' },
              take: 10,
            });
            for (const n of notifications) {
              if (!active) return;
              const event = `id: ${n.id}\nevent: new-booking\ndata: ${n.data}\n\n`;
              controller.enqueue(new TextEncoder().encode(event));
              await prisma.pendingNotification.update({
                where: { id: n.id },
                data: { delivered: true },
              });
            }
          } catch {
            // connection issue, retry
          }
          // Wait 4 seconds before next poll
          await new Promise(resolve => setTimeout(resolve, 4000));
        }
        controller.close();
      };
      poll();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
