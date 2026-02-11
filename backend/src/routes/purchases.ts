import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../db/mongo';

const router = Router();

// GET all purchases for tenant
router.get('/', async (req: Request, res: Response) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    const db = await getDatabase();
    const purchases = await db.collection('purchases')
      .find({ tenantId })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});

// GET single purchase by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    const db = await getDatabase();
    const purchase = await db.collection('purchases').findOne({
      _id: new ObjectId(req.params.id),
      tenantId
    });

    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    res.json(purchase);
  } catch (error) {
    console.error('Error fetching purchase:', error);
    res.status(500).json({ error: 'Failed to fetch purchase' });
  }
});

// GET purchase summary (totals, counts)
router.get('/summary/stats', async (req: Request, res: Response) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    const db = await getDatabase();
    const summary = await db.collection('purchases').aggregate([
      { $match: { tenantId } },
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          totalItems: { $sum: { $size: '$items' } }
        }
      }
    ]).toArray();

    res.json(summary[0] || { totalPurchases: 0, totalAmount: 0, totalItems: 0 });
  } catch (error) {
    console.error('Error fetching purchase summary:', error);
    res.status(500).json({ error: 'Failed to fetch purchase summary' });
  }
});

// POST create new purchase
router.post('/', async (req: Request, res: Response) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    const { items, totalAmount, note, supplierName, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required' });
    }

    const db = await getDatabase();
    
    // Generate purchase number
    const lastPurchase = await db.collection('purchases')
      .findOne({ tenantId }, { sort: { createdAt: -1 } });
    
    const purchaseNumber = lastPurchase 
      ? `PUR-${String(parseInt((lastPurchase.purchaseNumber || 'PUR-0').split('-')[1]) + 1).padStart(6, '0')}`
      : 'PUR-000001';

    const purchase = {
      tenantId,
      purchaseNumber,
      items: items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        sku: item.sku || '',
        barcode: item.barcode || '',
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.quantity) * Number(item.unitPrice),
        batchNo: item.batchNo || '',
        expireDate: item.expireDate || null,
        image: item.image || ''
      })),
      totalAmount: Number(totalAmount),
      supplierName: supplierName || '',
      paymentMethod: paymentMethod || 'cash',
      note: note || '',
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('purchases').insertOne(purchase);

    // Update product stock for each item
    for (const item of items) {
      if (item.productId) {
        await db.collection('products').updateOne(
          { _id: new ObjectId(item.productId), tenantId },
          { 
            $inc: { stock: Number(item.quantity) },
            $set: { updatedAt: new Date() }
          }
        );
      }
    }

    res.status(201).json({ 
      ...purchase, 
      _id: result.insertedId,
      message: 'Purchase created successfully' 
    });
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ error: 'Failed to create purchase' });
  }
});

// PUT update purchase
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    const { items, totalAmount, note, supplierName, paymentMethod, status } = req.body;
    const db = await getDatabase();

    const existingPurchase = await db.collection('purchases').findOne({
      _id: new ObjectId(req.params.id),
      tenantId
    });

    if (!existingPurchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    const updateData: any = {
      updatedAt: new Date()
    };

    if (items) updateData.items = items;
    if (totalAmount !== undefined) updateData.totalAmount = Number(totalAmount);
    if (note !== undefined) updateData.note = note;
    if (supplierName !== undefined) updateData.supplierName = supplierName;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    if (status) updateData.status = status;

    await db.collection('purchases').updateOne(
      { _id: new ObjectId(req.params.id), tenantId },
      { $set: updateData }
    );

    res.json({ message: 'Purchase updated successfully' });
  } catch (error) {
    console.error('Error updating purchase:', error);
    res.status(500).json({ error: 'Failed to update purchase' });
  }
});

// DELETE purchase
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    const db = await getDatabase();
    
    const purchase = await db.collection('purchases').findOne({
      _id: new ObjectId(req.params.id),
      tenantId
    });

    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    // Reverse stock updates
    for (const item of purchase.items) {
      if (item.productId) {
        await db.collection('products').updateOne(
          { _id: new ObjectId(item.productId), tenantId },
          { 
            $inc: { stock: -Number(item.quantity) },
            $set: { updatedAt: new Date() }
          }
        );
      }
    }

    await db.collection('purchases').deleteOne({
      _id: new ObjectId(req.params.id),
      tenantId
    });

    res.json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    console.error('Error deleting purchase:', error);
    res.status(500).json({ error: 'Failed to delete purchase' });
  }
});

export default router;
