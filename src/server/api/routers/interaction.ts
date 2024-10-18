import { string, z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import HttpStatus from "../../statusCodes";
import { prisma } from "@/server/db";

export const interactionRouter = createTRPCRouter({
    createInteraction: protectedProcedure
        .input(z.object({
            title: z.string(),
        }))
        .mutation(async opts => {
            try {

                const { title } = opts.input;

                const createInt = await opts.ctx.prisma.interaction.create({
                    data: {
                        title,
                        userId: opts.ctx.session.user.id
                    }
                })

                return {
                    code: HttpStatus.OK,
                    message: 'OK',
                    response: createInt
                }

            } catch (error) {
                return {
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'INTERNAL_SERVER_ERROR',
                    response: null
                }
            } finally {
                await opts.ctx.prisma.$disconnect();
            }
        }),
    getAllInteractions: protectedProcedure
        .mutation(async opts => {
            try {

                const interactions = await opts.ctx.prisma.interaction.findMany({
                    where: {
                        userId: opts.ctx.session.user.id
                    }
                })

                return {
                    code: HttpStatus.OK,
                    message: 'OK',
                    response: interactions
                }

            } catch (error) {
                return {
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'INTERNAL_SERVER_ERROR',
                    response: null
                }
            } finally {
                await opts.ctx.prisma.$disconnect();
            }
        }),
    deleteInteraction: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(async opts => {
            try {

                const { id } = opts.input;

                const interaction = await opts.ctx.prisma.interaction.findFirst({ where: { id } });

                if (!interaction) {
                    return {
                        code: HttpStatus.NOT_FOUND,
                        message: 'NOT_FOUND',
                        response: null
                    }
                }

                const isAuthorised = interaction.userId = opts.ctx.session.user.id;

                if (!isAuthorised) {
                    return {
                        code: HttpStatus.UNAUTHORIZED,
                        message: 'UNAUTHORIZED',
                        response: null
                    }
                }

                const remove = await opts.ctx.prisma.interaction.delete({
                    where: {
                        id
                    }
                })

                return {
                    code: HttpStatus.OK,
                    message: 'OK',
                    response: remove
                }

            } catch (error) {
                return {
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'INTERNAL_SERVER_ERROR',
                    response: null
                }
            } finally {
                await opts.ctx.prisma.$disconnect();
            }
        }),
    addMcq: protectedProcedure
        .input(z.object({
            title: z.string(),
            options: z.string().array(),
            serialNo: z.number(),
            interactionId: z.string()
        }))
        .mutation(async opts => {
            try {

                const { title, options, serialNo, interactionId } = opts.input;

                const interaction = await opts.ctx.prisma.interaction.findFirst({
                    where: {
                        id: interactionId
                    }
                })

                if (!interaction) {
                    return {
                        code: HttpStatus.NOT_FOUND,
                        message: 'NOT_FOUND',
                        response: null
                    }
                }

                const createQuestion = await opts.ctx.prisma.multipleChoiceQuestion.create({
                    data: {
                        title,
                        options,
                        interactionId,
                        serialNo
                    }
                })

                return {
                    code: HttpStatus.OK,
                    message: 'OK',
                    response: createQuestion
                }

            } catch (error) {
                return {
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'INTERNAL_SERVER_ERROR',
                    response: null
                }
            } finally {
                await opts.ctx.prisma.$disconnect();
            }
        }),
    addWordCloud: protectedProcedure
        .input(z.object({
            title: z.string(),
            serialNo: z.number(),
            interactionId: z.string()
        }))
        .mutation(async opts => {
            try {

                const { title, serialNo, interactionId } = opts.input;

                const interaction = await opts.ctx.prisma.interaction.findFirst({
                    where: {
                        id: interactionId
                    }
                })

                if (!interaction) {
                    return {
                        code: HttpStatus.NOT_FOUND,
                        message: 'NOT_FOUND',
                        response: null
                    }
                }

                const createQuestion = await opts.ctx.prisma.wordCloudQuestion.create({
                    data: {
                        title,
                        interactionId,
                        serialNo
                    }
                })

                return {
                    code: HttpStatus.OK,
                    message: 'OK',
                    response: createQuestion
                }

            } catch (error) {
                return {
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'INTERNAL_SERVER_ERROR',
                    response: null
                }
            } finally {
                await opts.ctx.prisma.$disconnect();
            }
        }),
    addOpenTextQuestion: protectedProcedure
        .input(z.object({
            title: z.string(),
            serialNo: z.number(),
            interactionId: z.string()
        }))
        .mutation(async opts => {
            try {

                const { title, serialNo, interactionId } = opts.input;

                const interaction = await opts.ctx.prisma.interaction.findFirst({
                    where: {
                        id: interactionId
                    }
                })

                if (!interaction) {
                    return {
                        code: HttpStatus.NOT_FOUND,
                        message: 'NOT_FOUND',
                        response: null
                    }
                }

                const createQuestion = await opts.ctx.prisma.openTextQuestion.create({
                    data: {
                        title,
                        interactionId,
                        serialNo
                    }
                })

                return {
                    code: HttpStatus.OK,
                    message: 'OK',
                    response: createQuestion
                }

            } catch (error) {
                return {
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'INTERNAL_SERVER_ERROR',
                    response: null
                }
            } finally {
                await opts.ctx.prisma.$disconnect();
            }
        }),
    updateQuestionTitle: protectedProcedure
        .input(z.object({
            type: z.string(),
            title: z.string(),
            id: z.string()
        }))
        .mutation(async opts => {
            try {

                const { type, title, id } = opts.input;

                if (type === 'Mcq') {
                    const update = await opts.ctx.prisma.multipleChoiceQuestion.update({
                        where: {
                            id
                        },
                        data: {
                            title
                        }
                    })

                    return {
                        code: HttpStatus.OK,
                        message: 'OK',
                        response: update
                    }
                }

                if (type === 'Word') {
                    const update = await opts.ctx.prisma.wordCloudQuestion.update({
                        where: {
                            id
                        },
                        data: {
                            title
                        }
                    })

                    return {
                        code: HttpStatus.OK,
                        message: 'OK',
                        response: update
                    }
                }

                if (type === 'Text') {
                    const update = await opts.ctx.prisma.openTextQuestion.update({
                        where: {
                            id
                        },
                        data: {
                            title
                        }
                    })

                    return {
                        code: HttpStatus.OK,
                        message: 'OK',
                        response: update
                    }
                }

                return {
                    code: HttpStatus.BAD_REQUEST,
                    message: 'BAD_REQUEST',
                    response: null
                }

            } catch (error) {
                return {
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'INTERNAL_SERVER_ERROR',
                    response: null
                }
            } finally {
                await opts.ctx.prisma.$disconnect();
            }
        }),
    getAllQuestions: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .mutation(async opts => {
            try {

                const { id } = opts.input;

                const mcqs = await opts.ctx.prisma.multipleChoiceQuestion.findMany({ where: { interactionId: id } });
                const words = await opts.ctx.prisma.wordCloudQuestion.findMany({ where: { interactionId: id } });
                const text = await opts.ctx.prisma.openTextQuestion.findMany({ where: { interactionId: id } });

                return {
                    code: HttpStatus.OK,
                    message: 'OK',
                    response: {
                        mcq: mcqs,
                        word: words,
                        text: text
                    }
                }

            } catch (error) {
                return {
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'INTERNAL_SERVER_ERROR',
                    response: null
                }
            } finally {
                await opts.ctx.prisma.$disconnect();
            }
        }),
    addOptions: protectedProcedure
        .input(z.object({
            options: z.string().array(),
            id: z.string()
        }))
        .mutation(async opts => {
            try {

                const { options, id } = opts.input;

                const question = await opts.ctx.prisma.multipleChoiceQuestion.findFirst({
                    where: {
                        id
                    }
                })

                if (!question) {
                    return {
                        code: HttpStatus.NOT_FOUND,
                        message: 'NOT_FOUND',
                        response: null
                    }
                }

                const update = await opts.ctx.prisma.multipleChoiceQuestion.update({
                    where: {
                        id
                    },
                    data: {
                        options
                    }
                })

                return {
                    code: HttpStatus.OK,
                    message: 'OK',
                    response: update
                }

            }  catch (error) {
                return {
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'INTERNAL_SERVER_ERROR',
                    response: null
                }
            } finally {
                await opts.ctx.prisma.$disconnect();
            }
        })
})