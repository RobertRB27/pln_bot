import { NextRequest } from "next/server"
import OpenAI from "openai"
import { MessageContent } from "openai/resources/beta/threads";

const assistantId = "asst_QUh3V3TzbQB1bxf9b11Xnp4U"
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function waitForResult(threadId: string, runId: string):Promise<void> {
    return new Promise<void>((resolve, reject) => {
        async function verifyStatus() {
            try {
                const currentRun = await openai.beta.threads.runs.retrieve(threadId, runId)
                if (currentRun.status === "completed") {
                    resolve()
                } else {
                    console.log(currentRun.status)
                    setTimeout(verifyStatus, 1000)
                }
            } catch(e) {
                reject(e)
            }
        }
        verifyStatus()
    })
}


export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams
    const textToSearch = params.get("search")
    let result: string = "";

    if (textToSearch === null ) {
        return Response.json({data: result})
    }

    try {
        const assistant = await openai.beta.assistants.retrieve(assistantId)
        const thread = await openai.beta.threads.create()
        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: textToSearch
        })
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistant.id
        })

        await waitForResult(thread.id, run.id)

        const messages = await openai.beta.threads.messages.list(thread.id);
        messages.data.forEach(m => {
            if (m.role === "assistant") {
                const content: MessageContent[] = m.content as MessageContent[];
                result = content[0].text.value
            }
        })
        
    } catch(e) {
        console.error("No se pudo obtener el asistente" , e)
    }

    return Response.json({data: result})

}   