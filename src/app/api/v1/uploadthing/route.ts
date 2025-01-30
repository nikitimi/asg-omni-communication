import { NextResponse, type NextRequest } from "next/server";
import { UTApi } from "uploadthing/server";

export async function POST(req: NextRequest) {
  const utapi = new UTApi();
  const formdata = await req.formData();
  const files = formdata.get("files") as unknown as File[];

  const response = await utapi.uploadFiles(files);
  return NextResponse.json({
    success: true,
    message: response.map(({ data }) => ({ key: data?.key, url: data?.url })),
  });
}
