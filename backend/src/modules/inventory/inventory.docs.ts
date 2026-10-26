/**
 * @swagger
 * /api/v1/inventories:
 *   post:
 *     summary: Create Inventory
 *     description: Create a new inventory item (bahan baku)
 *     tags:
 *       - Inventories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Beras
 *               unitId:
 *                 type: string
 *                 format: uuid
 *               currentStock:
 *                 type: number
 *                 example: 100
 *               minimumStock:
 *                 type: number
 *                 example: 10
 *             required:
 *               - name
 *               - unitId
 *               - currentStock
 *               - minimumStock
 *     responses:
 *       201:
 *         description: Inventory created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       unitId:
 *                         type: string
 *                       currentStock:
 *                         type: number
 *                       minimumStock:
 *                         type: number
 *                       isActive:
 *                         type: boolean
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     summary: Get All Inventories
 *     description: Retrieve all active inventory items
 *     tags:
 *       - Inventories
 *     responses:
 *       200:
 *         description: Inventories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       unitId:
 *                         type: string
 *                       currentStock:
 *                         type: number
 *                       minimumStock:
 *                         type: number
 *                       isActive:
 *                         type: boolean
 *
 * /api/v1/inventories/{id}:
 *   get:
 *     summary: Get Inventory by ID
 *     description: Retrieve a specific inventory item by its ID
 *     tags:
 *       - Inventories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Inventory retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       404:
 *         description: Inventory not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     summary: Update Inventory
 *     description: Update inventory name, unit, stock levels, or active status
 *     tags:
 *       - Inventories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               unitId:
 *                 type: string
 *                 format: uuid
 *               currentStock:
 *                 type: number
 *               minimumStock:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Inventory updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       404:
 *         description: Inventory not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete Inventory
 *     description: Soft delete an inventory item by setting isActive to false
 *     tags:
 *       - Inventories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Inventory deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Inventory not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export {};
