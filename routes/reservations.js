const express = require("express");
const router = express.Router({mergeParams:true});

const {getReservations,getReservation, addReservation, updateReservation, deleteReservation} = require("../controllers/reservations");

const {protect,authorize} = require("../middleware/auth");

router.route("/").get(protect,getReservations).post(protect,addReservation);

router.route("/:id").get(protect,getReservation).put(protect,updateReservation).delete(protect,deleteReservation);

/**
 *  @swagger
 *  components:
 *    schemas:
 *        Reservation:
 *            type: object
 *            required:
 *                - date
 *                - user
 *                - shop
 *            properties:
 *                id:
 *                    type: string
 *                    format: uuid
 *                    description: The auto-generated id of the reservation
 *                    example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *                date:
 *                    type: date
 *                    description: date and time of reservation
 *                user:
 *                    type: string
 *                    format: uuid
 *                    description: The id of user reserving
 *                    example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *                shop:
 *                    type: string
 *                    format: uuid
 *                    description: The id of shop getting reserved
 *                    example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *            example:
 *                id: 609bda561452242d88d36e37
 *                date: 2024-02-27T10:22:58.700+00:00
 *                user: 65dae6d1a42043d962f4baef
 *                shop: 65debb972103f416afc2358c
 */

/**  
 * @swagger
 *  tags:
 *      name: Reservations
 *      description : Reservations managing API
 */

/**
 * @swagger
 *  /reservations:   
 *   get:
 *      summary: Returns the list of accessible reservations
 *      tags: [Reservations]
 *      responses:
 *          200:
 *              description: The list of the reservations
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Reservation'
 */

/**
* @swagger
* /reservations/{id}:
*   get:
*       summary: Get the reservation by id
*       tags: [Reservations]
*       parameters:
*           - in: path
*             name: id
*             schema:
*               type: string
*             required: true
*             description: The reservation id
*       responses:
*           200:
*                   description: The reservation description by id
*                   contents:
*                       application/json:
*                           schema:
*                               $ref: '#/components/schemas/Reservation'
*           404:
*             description: The reservation was not found
*           500:
*             description: Some server error
*/
/**
 * @swagger
 *  /reservations:
 *    post:
 *      summary: Create a new reservation
 *      tags: [Reservations]
 *      requestBody:
 *        required: true
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *      responses:
 *       201:
 *          description: The reservation was successfully created
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Reservation'
 *       400:
 *          description: Invalid reservation
 *       404:
 *          description: The shop was not found
 *       500:
 *          description: Some error happened
 */


/**
* @swagger
* /reservations/{id}:
*   put:
*           summary: Update the reservation by the id
*           tags: [Reservations]
*           parameters:
*             - in: path
*               name: id
*               schema:
*                   type: string
*               required: true
*               description: The reservation id
*           requestBody:
*               required: true
*               content:
*                   application/json:
*                       schema:
*                           $ref: "#/components/schemas/Reservation"
*           responses:
*               200:
*                   description: The reservation was updated
*                   content:
*                       application/json:
*                           schema:
*                               $ref: '#/components/schemas/Reservation'
*               404:
*                   description: The reservation was not found
*               500:
*                   description: Some error happened
*/

/**
* @swagger
* /reservations/{id}:
*   delete:
*       summary: Remove the reservation by id
*       tags: [Reservations]
*       parameters:
*         - in: path
*           name: id
*           schema:
*               type: string
*           required: true
*           description: The reservation id
*
*       responses:
*           200:
*               description: The reservation was deleted
*           401:
*               description: Not authorized to delete reservation
*           404:
*               description: The reservation was not found
*           500:
*               description: Some error happened
*           
*/

module.exports = router