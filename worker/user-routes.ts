import { Hono } from "hono";
import type { Env } from './core-utils';
import { ProjectEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { Project } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // PROJECTS
  app.get('/api/projects', async (c) => {
    // Ensure the database is seeded with demo content if empty
    await ProjectEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const ownerId = c.req.query('ownerId');
    let { items, next } = await ProjectEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : 100);
    // Filter by ownerId if provided
    if (ownerId) {
      items = items.filter(p => p.ownerId === ownerId);
    }
    return ok(c, { items, next });
  });
  app.get('/api/projects/:id', async (c) => {
    const id = c.req.param('id');
    const entity = new ProjectEntity(c.env, id);
    if (!await entity.exists()) return notFound(c, 'Project not found');
    return ok(c, await entity.getState());
  });
  app.post('/api/projects', async (c) => {
    const body = await c.req.json() as Partial<Project>;
    if (!body.title || !body.tagline || !body.url) {
      return bad(c, 'Missing required fields: title, tagline, url');
    }
    const project: Project = {
      id: crypto.randomUUID(),
      title: body.title,
      tagline: body.tagline,
      description: body.description || "",
      url: body.url,
      logoUrl: body.logoUrl,
      screenshotUrl: body.screenshotUrl,
      tags: body.tags || [],
      ownerId: body.ownerId || "anonymous",
      createdAt: Date.now(),
      votes: 0
    };
    const created = await ProjectEntity.create(c.env, project);
    return ok(c, created);
  });
  app.post('/api/projects/:id/vote', async (c) => {
    const id = c.req.param('id');
    const entity = new ProjectEntity(c.env, id);
    if (!await entity.exists()) return notFound(c, 'Project not found');
    const updated = await entity.mutate(s => ({ ...s, votes: (s.votes || 0) + 1 }));
    return ok(c, updated);
  });
  app.put('/api/projects/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json() as Partial<Project>;
    const entity = new ProjectEntity(c.env, id);
    if (!await entity.exists()) return notFound(c, 'Project not found');
    const current = await entity.getState();
    const updated = await entity.update({ ...body, votes: body.votes !== undefined ? body.votes : current.votes });
    return ok(c, updated);
  });
  app.delete('/api/projects/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await ProjectEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  app.post('/api/projects/bulk-delete', async (c) => {
    const body = await c.req.json() as { ids: string[] };
    if (!body.ids || !Array.isArray(body.ids)) return bad(c, 'Invalid IDs array');
    const count = await ProjectEntity.deleteMany(c.env, body.ids);
    return ok(c, { count });
  });
}