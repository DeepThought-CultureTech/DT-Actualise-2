import { NextResponse, NextRequest } from "next/server";
import { connectDatabase } from "@/lib/mongodb";
import { toObjectId } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
    try {
        const userId = await req.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({
                error: 'User Id Required',
            }, { status: 400 })
        }

        const { db } = await connectDatabase();

        const manifestoEntry = await db.collection("manifesto_answers").findOne({ userId: toObjectId(userId) });

        if (!manifestoEntry?._id) {
            return NextResponse.json({
                message: 'Manifesto Not Submitted'
            }, { status: 200 });
        }

        const currentUserRole = await db.collection("users").findOne({ _id: toObjectId(userId) },
            { projection: {currentRoleId: 1 }}
        )

        const roleWhatsappLink = await db.collection("roles").findOne(
            { _id: toObjectId(currentUserRole?.currentRoleId)}, 
            {
                projection: { round2WhatsappLink: 1 }
            }
        )

        return NextResponse.json({
            message: 'Manifesto Already Submitted',
            whatsappLink: roleWhatsappLink?.round2WhatsappLink
        }, { status: 409 });


    } catch (error) {
        console.error('Error fetching manifesto submission:', error);

        return NextResponse.json(
            { error: 'Unable to fetch manifesto submission' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId, user_email, q1, q2, q3 } = await req.json();

        if (!userId || !user_email || !q1 || !q2 || !q3) {
            return NextResponse.json({
                error: 'Incomplete Request Body',
            }, { status: 400 })
        }

        const { db } = await connectDatabase();

        await db.collection('manifesto_answers').insertOne({
            userId: toObjectId(userId),
            userEmail: user_email,
            negative_prompting: q1,
            prompt_engineering: q2,
            growth_manifesto: q3,
            processed:false,
            submitted_at:new Date()
        });

        const currentUserRole = await db.collection("users").findOne({ _id: toObjectId(userId) },
            { projection: {currentRoleId: 1 }}
        )

        const roleWhatsappLink = await db.collection("roles").findOne(
            { _id: toObjectId(currentUserRole?.currentRoleId)}, 
            {
                projection: { round2WhatsappLink: 1 }
            }
        )

        return NextResponse.json({
            message: 'Manifesto Submitted!',
            whatsappLink: roleWhatsappLink?.round2WhatsappLink
        }, { status: 200 });

    } catch (error) {
        console.error('Error creating manifesto:', error);

        return NextResponse.json(
            { error: 'Unable to submit user manifesto' },
            { status: 500 }
        );
    }
}