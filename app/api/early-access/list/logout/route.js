import { supporterListHandler } from '@/lib/early-access/supporter-list-server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(request) { return supporterListHandler('logout', request); }
