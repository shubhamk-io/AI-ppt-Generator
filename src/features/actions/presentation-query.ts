import { createServerFn } from "@tanstack/react-start";
import { presentationIdInputSchema } from "../presentation/types/schema";
import { authMiddleware } from "#/components/middleware/auth";
import { prisma } from "#/lib/db";

export const getPresentationWithSlides = createServerFn({method:"Get"})
.inputValidator({data:unknown}=>presentationIdInputSchema.parse(data))
.middleware({authMiddleware})
.handler(async({data, context})=> {
    const userId = context?.session?.user?.id;




    const row = await prisma.presentation.findFirst({
        where: {
            id: data.id,
            userId,
        },
        include: {
            slides: {
                orderBy: {order: 'asc'}
            }
        }
    })

    return row;
    

})