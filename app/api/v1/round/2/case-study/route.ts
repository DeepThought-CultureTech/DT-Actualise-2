import { connectDatabase } from "@/lib/mongodb";
import { toObjectId } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { db } = await connectDatabase();

    // Fetch roles
    const rolesRaw = await db.collection("roles").find({ isRoleActive: true }).toArray();
    const roles = rolesRaw.map((role) => ({
      id: role._id.toString(),
      title: role.roleTitle,
    }));

    // Fetch case studies
    const roleids = roles.map(role => toObjectId(role.id));
    const caseStudiesRaw = await db.collection("case-studies").find({
  roleId: { $in: roleids }
}).toArray();
    const caseStudies = caseStudiesRaw.map((cs) => ({
      id: cs._id.toString(),
      title: cs.title,
      description: cs.description,
      content: cs.content,
      tags: Array.isArray(cs.tags) ? cs.tags : [],
      roleId: cs.roleId?.toString() || null,
    }));

    console.log(caseStudiesRaw, caseStudies)

    return NextResponse.json({
      roles,
      caseStudies,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
