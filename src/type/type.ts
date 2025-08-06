export const EVENTS = {
    JOIN_ROOM: "JOIN_ROOM",
    START_INTERACTION: "START_INTERACTION",
    START_INTERACTION_RESPONSE: "START_INTERACTION_RESPONSE",
    MCQ_ANSWER: "MCQ_ANSWER",
    MCQ_ANSWER_RESPONSE: "MCQ_ANSWER_RESPONSE"
}

export interface IJoinRoom {
    id: string
}

export interface IStartInteraction {
    id: string,
    rid: string,
    title: string,
    options: string[]
}

export interface IMcqAnswer {
    questionId: string,
    option: string,
    rid: string
}