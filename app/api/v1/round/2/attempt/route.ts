import { connectDatabase } from "@/lib/mongodb";
import { toObjectId } from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const attemptId = req.nextUrl.searchParams.get('id');

    if (!attemptId) {
        return NextResponse.json({
            error: "Requires Round 2 Attempt Id"
        }, { status: 400 })
    }

    try {
        const { db } = await connectDatabase();
        const round2attempt = await db.collection("round2_attempts").findOne(
            { _id: toObjectId(attemptId) },
            { projection: { userId: 1, caseStudyId: 1 } }
        )

        const user = await db.collection("users").findOne(
            { _id: toObjectId(round2attempt?.userId) },
            { projection: { currentRoleId: 1 } }
        )

        const role = await db.collection("roles").findOne(
            { _id: toObjectId(user?.currentRoleId) },
            { projection: { roleTitle: 1 }}
        )

        const caseStudy = await db.collection("case-studies").findOne(
            { _id: toObjectId(round2attempt?.caseStudyId) },
            { projection: { title: 1, content: 1 }  }
        )

        return NextResponse.json({
            message: "User Role & Case Study Chosen fetched successfully",
            roleTitle: role?.roleTitle,
            caseStudyTitle: caseStudy?.title,
            caseStudyContent: caseStudy?.content
        }, { status: 200 }) 
        
    } catch (err) {
        console.error('Error fetching round 2 attempt details', err);
        return NextResponse.json(
            { error: "Failed to fetch round 2 user attempt details" },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const { caseStudyId, userId } = await req.json();
        if (!caseStudyId || !userId) {
            return NextResponse.json({
                error: "Requires missing parameters"
            }, { status: 400 })
        }

        const { db } = await connectDatabase();

        const isAttempted = await db.collection("round2_attempts").findOne(
            { userId },
            { projection: { _id: 1 } }
        );

        if (isAttempted?._id) {
            return NextResponse.json({
                message: 'Round 2 Already Attempted',
            }, { status: 409 });
        }

        const currentDate = new Date()
        const initiatedRound2 = await db.collection("round2_attempts").insertOne({
            userId: toObjectId(userId),
            caseStudyId: toObjectId(caseStudyId),
            isSubmitted: false,
            createdAt: currentDate,
            updatedAt: currentDate
        });

        return NextResponse.json({
            attemptId: initiatedRound2.insertedId,
            message: "Round 2 Initiated"
        }, { status: 200 })

    } catch (err) {
        console.error('Error initiating round 2', err);
        return NextResponse.json(
            { error: "Failed to initiated round 2" },
            { status: 500 }
        )
    }
}

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        const attemptId = req.nextUrl.searchParams.get('id');

        if (!attemptId || !data) {
            return NextResponse.json({
                error: "attemptId & updated data required"
            }, { status: 400 })
        }

        data.updatedAt = new Date();

        const { db } = await connectDatabase();
        await db.collection("round2_attempts").updateOne({
            _id: toObjectId(attemptId)
        }, {
            $set: data
        });

        return NextResponse.json({
            message: "Round 2 Attempt Data Updated"
        }, { status: 200 })

    } catch (err) {
        console.error('Error updating round 2 attempt', err);
        return NextResponse.json(
            { error: "Failed to update round 2 attempt" },
            { status: 500 }
        )
    }
}