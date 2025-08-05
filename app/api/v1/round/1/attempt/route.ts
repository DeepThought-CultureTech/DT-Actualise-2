import { connectDatabase } from "@/lib/mongodb";
import { toObjectId } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const attemptId = req.nextUrl.searchParams.get('id');

        if(!attemptId) {
            return NextResponse.json({
                error: "Requires attempt id"
            }, { status: 400 })
        }

        const { db } = await connectDatabase();
        const attempt = await db.collection("round1_attempts").findOne(
            { _id: toObjectId(attemptId) }, 
            { projection: { roleId: 1, isSubmitted: 1 }}
        );

        const roleData = await db.collection('roles').findOne(
            { _id: toObjectId(attempt?.roleId) },
            { projection: { roleTitle: 1 }}
        );

        if(attempt?.isSubmitted) {
            return NextResponse.json({
                message: 'Round 1 for this role is already attempted',
                roleTitle: roleData?.roleTitle
            }, { status: 409 })
        }

        

        const scenarios = await db.collection("roles_scenarios").aggregate([
            { $match: { roleId: toObjectId(attempt?.roleId) } },
            {
                $lookup: {
                    from: "scenarios_questions",
                    localField: "_id",
                    foreignField: "scenarioId",
                    as: "questions"
                }
            },
            {
                $project: {
                    id: { $toString: "$_id" },
                    _id: 0,
                    scenarioTitle: { $toString: "$scenario_title" },
                    scenarioDescription: { $toString: "$scenario_description" },
                    questions: {
                        $map: {
                            input: "$questions",
                            as: "question",
                            in: {
                                id: { $toString: "$$question._id" },
                                questionText: "$$question.questionText"
                            }
                        }
                    }
                }
            }
        ]).toArray();

        return NextResponse.json({
            message: "Role Data, Scenarios & Questions fetched successfully",
            roleTitle: roleData?.roleTitle,
            scenarios
        }, { status: 200 })


    } catch (err) {
        console.error('Error fetching round 1 questions', err);
        return NextResponse.json(
            { error: "Failed to fetch round 1 questions"}, 
            {status: 500}
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const { roleId, userId } = await req.json();
        if(!roleId || !userId) {
            return NextResponse.json({
                error: "Requires missing parameters"
            }, { status: 400 })
        } 

        const { db } = await connectDatabase();

        const isRoleAttempted = await db.collection("round1_attempts").findOne(
            { roleId, userId },
            { projection: { _id: 1 } }
        );

        await db.collection("users").updateOne(
            { _id: toObjectId(userId) },
            { 
                $set: {
                    currentRoleId: toObjectId(roleId),
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        )

        if(isRoleAttempted?._id) {
            return NextResponse.json({
                message: 'Role Already Attempted',
                attemptId: isRoleAttempted._id
            }, { status: 409 });
        }

        const currentDate = new Date()
        const initiatedRound = await db.collection("round1_attempts").insertOne({
            roleId,
            userId,
            isSubmitted: false,
            createdAt: currentDate,
            updatedAt: currentDate
        });

        return NextResponse.json({
            attemptId: initiatedRound.insertedId,
            message: "Round 1 Initiated"
        }, { status: 200})
        
    } catch (err) {
        console.error('Error updating round 1 attempt', err);
        return NextResponse.json(
            { error: "Failed to update round 1 attempt"}, 
            {status: 500}
        )
    }
}

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        const attemptId = req.nextUrl.searchParams.get('id');

        if(!attemptId || !data) {
            return NextResponse.json({
                error: "attemptId & updated data required"
            }, { status: 400 })
        } 

        data.updatedAt = new Date();

        const { db } = await connectDatabase();
        await db.collection("round1_attempts").updateOne({
            _id: toObjectId(attemptId)
        },{ 
            $set: data
        });

        return NextResponse.json({
            message: "Round 1 Attempt Data Updated"
        }, { status: 200})
        
    } catch (err) {
        console.error('Error initiating round 1', err);
        return NextResponse.json(
            { error: "Failed to initiated round 1"}, 
            {status: 500}
        )
    }
}