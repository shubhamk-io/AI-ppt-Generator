import { createServerFn } from "@tanstack/react-start";
import {
    createPresentationInputSchema,
    updatePresentationInputSchema,
} from "../presentation/types/schema";
import { authFnMiddleware } from "#/components/middleware/auth";
import { prisma } from "#/lib/db";
import { generateSlug } from "random-word-slugs";
import { presentationStatus } from "#/generated/prisma/enums";

// ✅ CREATE
export const createPresentation = createServerFn({ method: "POST" })
    .inputValidator((data: unknown) =>
        createPresentationInputSchema.parse(data)
    )
    .middleware([authFnMiddleware])
    .handler(async ({ data, context }) => {
        const userId = context.session.user.id;

        const presentation = await prisma.presentation.create({
            data: {
                userId,
                title: generateSlug(),
                prompt: data.prompt, // ✅ REQUIRED FIELD
                slideCount: data.slideCount,
                style: data.style,
                tone: data.tone,
                layout: data.layout,
                status: presentationStatus.COMPLETED,
            },
        });

        return presentation;
    });

// ✅ UPDATE
export const updatePresentation = createServerFn({ method: "POST" })
    .inputValidator((data: unknown) =>
        updatePresentationInputSchema.parse(data)
    )
    .middleware([authFnMiddleware])
    .handler(async ({ data, context }) => {
        const userId = context.session.user.id;

        const { id, ...updateData } = data; // ✅ correct destructuring

        const existing = await prisma.presentation.findFirst({
            where: { id, userId },
        });

        if (!existing) throw new Error("NOT_FOUND");

        return prisma.presentation.update({
            where: { id },
            data: updateData, // ✅ proper object
        });
    });


    // Delete presentaion 
    export const deletePresentation = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (!data || typeof data !== "object" || !("id" in data)) {
      throw new Error("Invalid input");
    }
    return data as { id: string };
  })
  .middleware([authFnMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;

    const { id } = data;

    const existing = await prisma.presentation.findFirst({
      where: { id, userId },
    });

    if (!existing) throw new Error("NOT_FOUND");

    await prisma.presentation.delete({
      where: { id }, // ✅ FIXED
    });

    return {
      ok: true as const,
    };
  });



  // Regenerate presentation
export const regeneratePresentation = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (!data || typeof data !== "object" || !("id" in data)) {
      throw new Error("Invalid input");
    }
    return data as { id: string };
  })
  .middleware([authFnMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id; // ✅ removed optional chaining

    const { id } = data; // ✅ safe destructuring

    const existing = await prisma.presentation.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) throw new Error("NOT_FOUND"); // ✅ consistent

    await prisma.presentation.update({
      where: {
        id,
      },
      data: {
        status: presentationStatus.GENERATING,
      },
    });

    return { ok: true as const };
  });