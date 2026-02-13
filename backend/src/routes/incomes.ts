import { Router } from 'express';
import { getDatabase } from '../db/mongo';
import { ObjectId } from 'mongodb';
import { createAuditLog } from './auditLogs';

export const incomesRouter = Router();

// Helper to extract tenantId from request
function getTenantId(req: any): string | null {
  return req.headers['x-tenant-id'] || (req as any).user?.tenantId || null;
}

// List with filters and pagination
incomesRouter.get('/', async (req, res, next) => {
  try {
    const db = await getDatabase();
    const col = db.collection('incomes');
    const tenantId = getTenantId(req);

    const { query, status, category, from, to } = req.query as any;
    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.pageSize ?? 10);

    const filter: any = {};
    if (tenantId) filter.tenantId = tenantId;
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (query) filter.name = { $regex: String(query), $options: 'i' };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = from;
      if (to) filter.date.$lte = to;
    }

    const total = await col.countDocuments(filter);
    const items = await col.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    res.json({ items, total });
  } catch (e) {
    next(e);
  }
});

// Summary
incomesRouter.get('/summary', async (req, res, next) => {
  try {
    const db = await getDatabase();
    const col = db.collection('incomes');
    const tenantId = getTenantId(req);

    const { from, to } = req.query as any;
    const filter: any = {};
    if (tenantId) filter.tenantId = tenantId;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = from;
      if (to) filter.date.$lte = to;
    }

    const items = await col.find(filter).toArray();
    const totalAmount = items.reduce((sum, i: any) => sum + Number(i.amount || 0), 0);
    const categories = new Set(items.map((i: any) => i.category)).size;
    const totalTransactions = items.length;

    res.json({ totalAmount, categories, totalTransactions });
  } catch (e) {
    next(e);
  }
});

// Income categories - list
incomesRouter.get('/categories', async (req, res, next) => {
  try {
    const db = await getDatabase();
    const col = db.collection('income_categories');
    const tenantId = getTenantId(req);
    const filter: any = {};
    if (tenantId) filter.tenantId = tenantId;
    const cats = await col.find(filter).sort({ name: 1 }).toArray();
    res.json(cats);
  } catch (e) {
    next(e);
  }
});

// Income categories - create
incomesRouter.post('/categories', async (req, res, next) => {
  try {
    const db = await getDatabase();
    const col = db.collection('income_categories');
    const tenantId = getTenantId(req);
    const { name } = req.body;
    const result = await col.insertOne({ name, tenantId, createdAt: new Date().toISOString() });
    res.status(201).json({ id: result.insertedId.toString(), name, tenantId });
  } catch (e) {
    next(e);
  }
});

// Create
incomesRouter.post('/', async (req, res, next) => {
  try {
    const db = await getDatabase();
    const col = db.collection('incomes');
    const tenantId = getTenantId(req);
    const payload = req.body;
    const result = await col.insertOne({
      ...payload,
      tenantId: tenantId || payload.tenantId,
      createdAt: new Date().toISOString(),
    });
    
    // Create audit log for income creation
    const user = (req as any).user;
    await createAuditLog({
      tenantId: payload.tenantId,
      userId: user?._id || user?.id || 'system',
      userName: user?.name || 'System',
      userRole: user?.role || 'system',
      action: 'Income Created',
      actionType: 'create',
      resourceType: 'income',
      resourceId: result.insertedId.toString(),
      resourceName: payload.name || 'Income',
      details: `Income "${payload.name || 'Income'}" created - ৳${payload.amount}`,
      metadata: { amount: payload.amount, source: payload.source },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });
    res.status(201).json({ ...payload, id: result.insertedId.toString() });
  } catch (e) {
    next(e);
  }
});

// Update
incomesRouter.put('/:id', async (req, res, next) => {
  try {
    const db = await getDatabase();
    const col = db.collection('incomes');
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const payload = req.body;
    
    let filter: any;
    try {
      filter = { _id: new ObjectId(id) };
    } catch {
      filter = { id };
    }
    if (tenantId) filter.tenantId = tenantId;

    await col.updateOne(filter, {
      $set: {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
    });
    res.json({ ...payload, id });
  } catch (e) {
    next(e);
  }
});

// Delete
incomesRouter.delete('/:id', async (req, res, next) => {
  try {
    const db = await getDatabase();
    const col = db.collection('incomes');
    const tenantId = getTenantId(req);
    const { id } = req.params;
    
    let filter: any;
    try {
      filter = { _id: new ObjectId(id) };
    } catch {
      filter = { id };
    }
    if (tenantId) filter.tenantId = tenantId;

    await col.deleteOne(filter);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

export default incomesRouter;
