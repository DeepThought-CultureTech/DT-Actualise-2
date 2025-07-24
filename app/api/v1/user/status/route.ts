import { ObjectId } from "mongodb";
import { connectDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { toObjectId } from "@/lib/mongodb";

export async function PUT(req: NextRequest) {
    try {
        const { userId, newStatus } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        if (!newStatus) {
            return NextResponse.json(
                { error: 'New status is required' },
                { status: 400 }
            )
        }

        const { db } = await connectDatabase();

        // add a check for validating user id format (ObjectId)

        await db.collection("users").updateOne(
            { _id: toObjectId(userId) },
            { 
                $set: {
                    status: newStatus,
                    updatedAt: new Date()
                } 
            }
        )

        return NextResponse.json({
            currentStatus: newStatus,
            message: "Updated user status",
        }, { status: 200 })

    } catch (err) {
        console.error('Error while updating user status', err)
        return NextResponse.json({
            error: "Unable to update user status"
        }, { status: 500 })
    }
}