import { NextRequest, NextResponse } from 'next/server';
import { connectDatabase } from '@/lib/mongodb'; // Adjust path as needed


export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const { db } = await connectDatabase();

    const existing = await db.collection("summary").findOne({ email });

    if (!existing) {
        return NextResponse.json({}, { status: 204 });
    }

    return NextResponse.json(existing, { status: 200 });
}



export async function POST(req: NextRequest) {
    try {
        const { summary, email, processed = false } = await req.json();

        if (!summary || !email) {
            return NextResponse.json({
                error: "Missing required parameters: summary or email"
            }, { status: 400 });
        }

        const { db } = await connectDatabase();

        const currentDate = new Date();

        const inserted = await db.collection("summary").insertOne({
            email,
            summary,
            processed: Boolean(processed),
            createdAt: currentDate,
            updatedAt: currentDate
        });

        return NextResponse.json({
            message: "Summary saved successfully",
            // summaryId: inserted.insertedId
        }, { status: 200 });

    } catch (err) {
        console.error('Error saving summary:', err);
        return NextResponse.json({
            error: "Failed to save summary"
        }, { status: 500 });
    }
}
