import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tableBlocks, restaurantTables } from '@/lib/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/closures
 * Get all exceptional closures
 */
export async function GET() {
  try {
    // Get all closures (blocks that affect all tables)
    const allTables = await db.select().from(restaurantTables).where(eq(restaurantTables.isActive, true));
    const allTableIds = allTables.map(t => t.id);

    const closures = await db
      .select()
      .from(tableBlocks)
      .where(gte(tableBlocks.endDatetime, new Date()))
      .orderBy(tableBlocks.startDatetime);

    // Filter to only show closures that block ALL tables
    const fullClosures = closures.filter(closure => {
      if (!closure.tableId) return false;
      // If it's a full closure, tableId should be null or we check if all tables are blocked
      return true;
    });

    return NextResponse.json({
      success: true,
      closures: closures.map(c => ({
        id: c.id,
        startDatetime: c.startDatetime,
        endDatetime: c.endDatetime,
        reason: c.reason,
        tableId: c.tableId,
      })),
    });
  } catch (error) {
    console.error('Error fetching closures:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des fermetures' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/closures
 * Create an exceptional closure
 *
 * Body:
 * - date: closure date (YYYY-MM-DD)
 * - startTime: start time (HH:MM) - optional for full day closure
 * - endTime: end time (HH:MM) - optional for full day closure
 * - reason: reason for closure
 * - type: 'full_day' | 'early_close' | 'partial'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, startTime, endTime, reason, type } = body;

    if (!date || !type || !reason) {
      return NextResponse.json(
        { error: 'Date, type et raison sont requis' },
        { status: 400 }
      );
    }

    // Get all active tables
    const allTables = await db
      .select()
      .from(restaurantTables)
      .where(eq(restaurantTables.isActive, true));

    if (allTables.length === 0) {
      return NextResponse.json(
        { error: 'Aucune table active trouvée' },
        { status: 404 }
      );
    }

    let startDatetime: Date;
    let endDatetime: Date;

    if (type === 'full_day') {
      // Block entire day
      startDatetime = new Date(`${date}T00:00:00`);
      endDatetime = new Date(`${date}T23:59:59`);
    } else {
      // Partial closure with specific times
      if (!startTime || !endTime) {
        return NextResponse.json(
          { error: 'Heure de début et de fin requises pour une fermeture partielle' },
          { status: 400 }
        );
      }
      startDatetime = new Date(`${date}T${startTime}:00`);
      endDatetime = new Date(`${date}T${endTime}:00`);
    }

    // Create blocks for all tables
    const blocks = [];
    for (const table of allTables) {
      const [block] = await db
        .insert(tableBlocks)
        .values({
          tableId: table.id,
          startDatetime,
          endDatetime,
          reason: `${type === 'full_day' ? 'Fermeture exceptionnelle' : 'Fermeture anticipée'}: ${reason}`,
        })
        .returning();
      blocks.push(block);
    }

    console.log('='.repeat(60));
    console.log('🚫 FERMETURE EXCEPTIONNELLE CRÉÉE');
    console.log('='.repeat(60));
    console.log(`Date: ${date}`);
    console.log(`Type: ${type}`);
    console.log(`Période: ${startDatetime.toLocaleString('fr-FR')} - ${endDatetime.toLocaleString('fr-FR')}`);
    console.log(`Raison: ${reason}`);
    console.log(`Tables bloquées: ${allTables.length}`);
    console.log('='.repeat(60));

    return NextResponse.json({
      success: true,
      message: 'Fermeture exceptionnelle créée avec succès',
      blocksCreated: blocks.length,
      closure: {
        startDatetime,
        endDatetime,
        reason,
        type,
      },
    });
  } catch (error) {
    console.error('Error creating closure:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la fermeture' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/closures
 * Delete a closure by removing all associated blocks
 *
 * Query params:
 * - date: closure date (YYYY-MM-DD)
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date requise' },
        { status: 400 }
      );
    }

    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    // Delete all blocks for this date
    await db
      .delete(tableBlocks)
      .where(
        and(
          gte(tableBlocks.startDatetime, startOfDay),
          lte(tableBlocks.endDatetime, endOfDay)
        )
      );

    return NextResponse.json({
      success: true,
      message: 'Fermeture supprimée avec succès',
    });
  } catch (error) {
    console.error('Error deleting closure:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la fermeture' },
      { status: 500 }
    );
  }
}
