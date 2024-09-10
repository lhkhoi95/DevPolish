import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";

export const config = {
  api: {
    bodyParser: false,
    responseLimit: "8mb",
  },
};

export async function POST(req: NextRequest) {
  const formData: FormData = await req.formData();
  const uploadedFile = formData.get("file");
  let parsedText = "";

  if (uploadedFile instanceof File) {
    if (uploadedFile.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 8MB limit" },
        { status: 400 }
      );
    }

    const pdfParser = new (PDFParser as any)(null, 1);

    // Wrap the parsing logic in a Promise
    const parsePDF = () => {
      return new Promise(async (resolve, reject) => {
        pdfParser.on("pdfParser_dataError", (errData: any) =>
          reject(errData.parserError)
        );
        pdfParser.on("pdfParser_dataReady", () => {
          parsedText = (pdfParser as any).getRawTextContent();
          resolve(parsedText);
        });

        pdfParser.parseBuffer(Buffer.from(await uploadedFile.arrayBuffer()));
      });
    };

    try {
      await parsePDF();
      return NextResponse.json({ text: parsedText });
    } catch (error) {
      console.error("Error parsing PDF:", error);
      return NextResponse.json(
        { error: "Failed to parse PDF" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { error: "No file or invalid file format" },
      { status: 400 }
    );
  }
}
