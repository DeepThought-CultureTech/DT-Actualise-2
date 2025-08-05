import { ObjectId } from "mongodb";
import { connectDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { toObjectId } from "@/lib/mongodb";

export async function PUT(req: NextRequest) {
    try {
        const { userId, currentRoleId } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        if (!currentRoleId) {
            return NextResponse.json(
                { error: 'roleId is required' },
                { status: 400 }
            )
        }

        const { db } = await connectDatabase();

        // add a check for validating user id format (ObjectId)

        await db.collection("users").updateOne(
            { _id: toObjectId(userId) },
            { 
                $set: {
                    currentRoleId: toObjectId(currentRoleId),
                    updatedAt: new Date()
                } 
            },
            { upsert: true }
        )

        return NextResponse.json({
            message: "Updated user's current role",
        }, { status: 200 })

    } catch (err) {
        console.error("Error while updating user's role", err)
        return NextResponse.json({
            error: "Unable to update user's role"
        }, { status: 500 })
    }
}