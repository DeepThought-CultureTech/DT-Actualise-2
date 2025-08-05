// /app/api/v1/round/asset/frameworks/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/lib/mongodb";
import { title } from "process";

// ✅ GET: Fetch frameworks by round
export async function GET(req: NextRequest) {
  try {
    const round =Number(req.nextUrl.searchParams.get("round"));
    
    if (!round) {
      return NextResponse.json(
        { message: "Missing round parameter in query string" },
        { status: 400 }
      );
    }
    const { db } = await connectDatabase();

    // const frameworks = await db
    //   .collection("frameworks")
    //   .find(
    //     { round },
    //     {
    //       projection: {
    //         _id: 1,
    //         title: 1,
    //         description: 1,
    //         image: 1,
    //         alt: 1,
    //         bgColor: 1,
    //         gridClass: 1,
    //       },
    //     }
    //   )
    //   .toArray();
    const frameworks = await db.collection("frameworks").find({round}).toArray();

      console.log(frameworks);
      

    return NextResponse.json(
      {
        message: "Frameworks fetched",
        frameworks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching frameworks:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ POST: Save a student's selected framework in a round
export async function POST(req: Request) {
  try {
    const { db } = await connectDatabase();
    const body = await req.json();

    const { studentId, frameworkId, round, selectedAt } = body;

    if (!studentId || !frameworkId || !round) {
      return NextResponse.json(
        {
          message: "Missing required fields: studentId, frameworkId, or round",
        },
        { status: 400 }
      );
    }

    const result = await db.collection("studentFrameworks").insertOne({
      studentId,
      frameworkId,
      round,
      selectedAt: selectedAt || new Date(),
    });

    return NextResponse.json(
      {
        message: "Framework selection saved successfully",
        id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving student framework:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
