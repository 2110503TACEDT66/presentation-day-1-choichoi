const express = require('express');
const router = express.Router();

const reservationRouter = require("./reservations");

const {getShop,getShops,createShop,updateShop,deleteShop} = require("../controllers/shops");

const {protect,authorize} = require("../middleware/auth");

//go to reservation router
router.use("/:shopId/reservations/", protect,reservationRouter);

router.route("/").get(getShops).post(protect, authorize("admin","shopkeeper"), createShop);
router.route("/:id").put(protect, authorize("admin","shopkeeper"), updateShop).get(getShop).delete(protect, authorize("admin","shopkeeper"), deleteShop);

/**
 *  @swagger
 *  components:
 *    schemas:
 *        Shop:
 *            type: object
 *            required:
 *                - name
 *                - address
 *            properties:
 *                id:
 *                    type: string
 *                    format: uuid
 *                    description: The auto-generated id of the shop
 *                    example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *                ลําดับ:
 *                    type: string
 *                    description: Ordinal number
 *                name:
 *                    type: string
 *                    description: Shop name
 *                address:
 *                    type: string
 *                    description: House No., Street, Road
 *                district:
 *                    type: string
 *                    description: District
 *                province:
 *                    type: string
 *                    description: province
 *                postalcode:
 *                    type: string
 *                    description: 5-digit postal code
 *                tel:
 *                    type: string
 *                    description: telephone number
 *                region:
 *                    type: string
 *                    description: region
 *            example:
 *                id: 609bda561452242d88d36e37
 *                ลําดับ: 121
 *                name: Happy Shop
 *                address: 121 ถ.สุขุมวิท
 *                district: บางนา
 *                province: กรุงเทพมหานคร
 *                postalcode: 10110
 *                tel: 02-2187000
 *                region: กรุงเทพมหานคร (Bangkok)
 */

/**  
 * @swagger
 *  tags:
 *      name: Shops
 *      description : Shops managing API
 */

/**
 * @swagger
 *  /shops:   
 *   get:
 *      summary: Returns the list of all the shops
 *      tags: [Shops]
 *      responses:
 *          200:
 *              description: The list of the shops
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Shop'
 */

/**
* @swagger
* /shops/{id}:
*   get:
*       summary: Get the shop by id
*       tags: [Shops]
*       parameters:
*           - in: path
*             name: id
*             schema:
*               type: string
*             required: true
*             description: The shop id
*       responses:
*           200:
*                   description: The shop description by id
*                   contents:
*                       application/json:
*                           schema:
*                               $ref: '#/components/schemas/Shop'
*           404:
*             description: The shop was not found
*/
/**
 * @swagger
 *  /shops:
 *    post:
 *      summary: Create a new shop
 *      tags: [Shops]
 *      requestBody:
 *        required: true
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shop'
 *      responses:
 *       201:
 *          description: The shop was successfully created
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Shop'
 *       500:
 *          description: Some server error
 */


/**
* @swagger
* /shops/{id}:
*   put:
*           summary: Update the shop by the id
*           tags: [Shops]
*           parameters:
*             - in: path
*               name: id
*               schema:
*                   type: string
*               required: true
*               description: The shop id
*           requestBody:
*               required: true
*               content:
*                   application/json:
*                       schema:
*                           $ref: "#/components/schemas/Shop"
*           responses:
*               200:
*                   description: The shop was updated
*                   content:
*                       application/json:
*                           schema:
*                               $ref: '#/components/schemas/Shop'
*               404:
*                   description: The shop was not found
*               500:
*                   description: Some error happened
*/

/**
* @swagger
* /shops/{id}:
*   delete:
*       summary: Remove the shop by id
*       tags: [Shops]
*       parameters:
*         - in: path
*           name: id
*           schema:
*               type: string
*           required: true
*           description: The shop id
*
*       responses:
*           200:
*               description: The shop was deleted
*           404:
*               description: The shop was not found
*/

module.exports = router;