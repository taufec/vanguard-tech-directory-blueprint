import { IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage, Project } from "@shared/types";
import { MOCK_CHATS, MOCK_USERS, MOCK_PROJECTS } from "@shared/mock-data";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "", role: "user" };
  static seedData = MOCK_USERS;
}
export class ProjectEntity extends IndexedEntity<Project> {
  static readonly entityName = "project";
  static readonly indexName = "projects";
  static readonly initialState: Project = {
    id: "",
    title: "",
    tagline: "",
    description: "",
    url: "",
    tags: [],
    ownerId: "",
    createdAt: 0,
    votes: 0
  };
  static seedData = MOCK_PROJECTS;
  async update(data: Partial<Project>): Promise<Project> {
    return this.mutate(s => ({ ...s, ...data }));
  }
}
export type ChatBoardState = Chat & { messages: ChatMessage[] };
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = MOCK_CHATS.map(c => ({ ...c, messages: [] }));
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}