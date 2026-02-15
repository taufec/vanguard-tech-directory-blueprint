import { Hono } from "hono";
import type { Env } from './core-utils';
import { ProjectEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { Project } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // PROJECTS LISTING
  app.get('/api/projects', async (c) => {
    await ProjectEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const ownerId = c.req.query('ownerId');
    let { items, next } = await ProjectEntity.list(
      c.env, 
      cq ?? null, 
      lq ? Math.max(1, (Number(lq) | 0)) : 100
    );
    if (ownerId) {
      items = items.filter(p => p.ownerId === ownerId);
    }
    return ok(c, { items, next });
  });
  // EXPORT ALL DATA
  app.get('/api/projects/export', async (c) => {
    const { items } = await ProjectEntity.list(c.env, null, 1000);
    return ok(c, items);
  });
  // BULK IMPORT DATA
  app.post('/api/projects/import', async (c) => {
    try {
      const projects = await c.req.json() as Project[];
      if (!Array.isArray(projects)) return bad(c, 'Invalid format: Expected array');
      const imported = [];
      for (const p of projects) {
        if (!p.title || !p.url) continue;
        const id = p.id || crypto.randomUUID();
        const project: Project = {
          ...p,
          id,
          createdAt: p.createdAt || Date.now(),
          votes: p.votes || 0,
          ownerId: p.ownerId || "imported",
          tags: Array.isArray(p.tags) ? p.tags : []
        };
        await ProjectEntity.create(c.env, project);
        imported.push(id);
      }
      return ok(c, { count: imported.length });
    } catch (e) {
      return bad(c, 'Import failed: ' + (e instanceof Error ? e.message : String(e)));
    }
  });
  // GET SINGLE PROJECT
  app.get('/api/projects/:id', async (c) => {
    const id = c.req.param('id');
    const entity = new ProjectEntity(c.env, id);
    if (!await entity.exists()) return notFound(c, 'Project not found');
    return ok(c, await entity.getState());
  });
  // CREATE PROJECT
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
  // VOTE
  app.post('/api/projects/:id/vote', async (c) => {
    const id = c.req.param('id');
    const entity = new ProjectEntity(c.env, id);
    if (!await entity.exists()) return notFound(c, 'Project not found');
    const updated = await entity.mutate(s => ({ 
      ...s, 
      votes: (s.votes || 0) + 1 
    }));
    return ok(c, updated);
  });
  // UPDATE PROJECT (ROBUSTIFIED)
  app.put('/api/projects/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json() as Partial<Project>;
    const entity = new ProjectEntity(c.env, id);
    if (!await entity.exists()) return notFound(c, 'Project not found');
    const current = await entity.getState();
    // Explicitly protect ownerId and createdAt from being overwritten by typical updates
    // Preserve votes unless the body explicitly provides a non-undefined value (e.g. from admin tools)
    const updated = await entity.update({
      ...body,
      id: current.id, // ID is immutable
      ownerId: current.ownerId, // Ownership cannot be changed via standard update
      createdAt: current.createdAt, // Creation date is immutable
      votes: body.votes !== undefined ? body.votes : current.votes
    });
    return ok(c, updated);
  });
  // DELETE PROJECT
  app.delete('/api/projects/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await ProjectEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  // BULK DELETE
  app.post('/api/projects/bulk-delete', async (c) => {
    const body = await c.req.json() as { ids: string[] };
    if (!body.ids || !Array.isArray(body.ids)) return bad(c, 'Invalid IDs array');
    const count = await ProjectEntity.deleteMany(c.env, body.ids);
    return ok(c, { count });
  });
}